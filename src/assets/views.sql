CREATE OR REPLACE VIEW v_candidate_rankings AS
WITH base AS (
  SELECT
    c.id                AS candidate_id,
    c.name              AS candidate_name,

    p.id                AS party_id,
    p.name              AS party_name,
    p.short_name        AS party_short_name,
    p.color_code        AS party_color,
    p.is_analytic       AS party_is_analytic,
    p.symbol_url        AS party_symbol,

    con.id              AS constituency_id,
    con.name            AS constituency_name,

    d.id                AS district_id,
    d.name              AS district_name,

    c.total_votes
  FROM candidates c
  JOIN parties p          ON p.id = c.party_id
  JOIN constituencies con ON con.id = c.constituency_id
  JOIN districts d        ON d.id = con.district_id
),
ranked AS (
  SELECT
    *,
    MAX(total_votes) OVER (PARTITION BY constituency_id) AS max_votes_in_constituency,
    RANK() OVER (
      PARTITION BY constituency_id
      ORDER BY total_votes DESC
    ) AS rank_in_constituency
  FROM base
)
SELECT *
FROM ranked;

--------------------------------------------------------

CREATE OR REPLACE VIEW v_state_seat_status AS
SELECT
  party_symbol,
  party_id,
  party_short_name,
  party_color,
  COUNT(DISTINCT constituency_id) AS seats_leading
FROM v_candidate_rankings
WHERE rank_in_constituency = 1
  AND max_votes_in_constituency > 0
  AND party_is_analytic = true
GROUP BY party_id, party_short_name, party_color, party_symbol
ORDER BY seats_leading DESC;

--------------------------------------------------------

CREATE OR REPLACE VIEW v_state_independent_status AS
SELECT
  COUNT(DISTINCT constituency_id) AS independent_seats
FROM v_candidate_rankings
WHERE rank_in_constituency = 1
  AND max_votes_in_constituency > 0
  AND party_is_analytic = false;

--------------------------------------------------------

CREATE OR REPLACE VIEW v_constituency_leader_margin AS
SELECT
  constituency_id,
  constituency_name,

  MAX(CASE WHEN rank_in_constituency = 1 THEN candidate_name END)
    AS leader_candidate,

  MAX(CASE WHEN rank_in_constituency = 1 THEN party_short_name END)
    AS leader_party,

  MAX(CASE WHEN rank_in_constituency = 1 THEN party_symbol END)
    AS leader_party_symbol,

  MAX(CASE WHEN rank_in_constituency = 2 THEN party_short_name END)
    AS competing_party,

  MAX(CASE WHEN rank_in_constituency = 2 THEN party_symbol END)
    AS competing_party_symbol,

  MAX(CASE WHEN rank_in_constituency = 1 THEN party_color END)
    AS leader_party_color,

  MAX(CASE WHEN rank_in_constituency = 1 THEN total_votes END)
  -
  MAX(CASE WHEN rank_in_constituency = 2 THEN total_votes END)
    AS vote_margin

FROM v_candidate_rankings
WHERE max_votes_in_constituency > 0
GROUP BY constituency_id, constituency_name;

----------------------------------------------------------

CREATE OR REPLACE VIEW v_district_seat_status AS
SELECT
  district_id,
  district_name,
  party_id,
  party_short_name,
  party_symbol,
  party_color,
  COUNT(DISTINCT constituency_id) AS seats_leading
FROM v_candidate_rankings
WHERE rank_in_constituency = 1
  AND max_votes_in_constituency > 0
  AND party_is_analytic = true
GROUP BY
  district_id,
  district_name,
  party_id,
  party_short_name,
  party_symbol,
  party_color
ORDER BY district_name, seats_leading DESC;
