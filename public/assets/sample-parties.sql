INSERT INTO parties (name, short_name, symbol_url, color_code)
VALUES 
('Dravida Munnetra Kazhagam', 'DMK', 'https://example.com/rising_sun.png', '#FF0000'),
('All India Anna Dravida Munnetra Kazhagam', 'AIADMK', 'https://example.com/two_leaves.png', '#008000'),

('Tamizhaga Vettri Kazhagam', 'TVK', 'https://example.com/tvk_flag.png', '#8B0000'),
('Naam Tamilar Katchi', 'NTK', 'https://example.com/ntk_lions.png', '#FFFF00'),
('Bharatiya Janata Party', 'BJP', 'https://example.com/bjp_lotus.png', '#FF9933'),

('Independent', 'IND', 'https://example.com/generic.png', '#808080');


INSERT INTO candidates (name, party_id, constituency_id, is_star_candidate, photo_url)
VALUES 
('M. K. Stalin', 1, 13, true, 'https://example.com/stalin.png'), -- Kolathur (Chennai)
('Edappadi K. Palaniswami', 2, 86, true, 'https://example.com/eps.png'), -- Edappadi (Salem)
('Vijay', 3, 234, true, 'https://example.com/vijay.png'), -- TVK Chief (Constituency TBD, often projected as a rural seat)
('Seeman', 4, 11, true, 'https://example.com/seeman.png'), -- NTK Chief (Often contests in RK Nagar or Thiruvottiyur)
('Udhayanidhi Stalin', 1, 19, true, 'https://example.com/udhaya.png'); -- Chepauk-Thiruvallikeni