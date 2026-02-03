/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConstituencyMargin } from "@/types";

const GEO_URL = "/assets/tn_map.geojson";

interface ConstituencyMapProps {
  data: ConstituencyMargin[];
}

export function ConstituencyMap({ data }: ConstituencyMapProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load map data", err));
  }, []);

  const normalizeName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s*\(sc\)|\s*\(st\)/gi, "")
      .trim();
  };

  const NAME_ALIASES: Record<string, string> = {
    tiruvallur: "thiruvallur",
    thiruvallur: "tiruvallur",
  };

  const dataMap = new Map();
  data.forEach((item) => {
    dataMap.set(normalizeName(item.constituency_name), item);
  });

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Constituency Map</span>
          <div className="flex gap-2">
            <Badge variant="outline">Interactive Map</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative min-h-125 bg-slate-50/50">
        {!geoData ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            Loading Map Data...
          </div>
        ) : (
          <div className="w-full h-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 6000,
                center: [78.4, 10.85],
              }}
              className="w-full h-full"
            >
              <Geographies geography={geoData}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const geoName = (
                      geo.properties.AC_NAME ||
                      geo.properties.ac_name ||
                      geo.properties.Name ||
                      geo.properties.NAME ||
                      ""
                    ).toString();

                    const normalizedGeoName = normalizeName(geoName);
                    const match =
                      dataMap.get(normalizedGeoName) ||
                      dataMap.get(NAME_ALIASES[normalizedGeoName]);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={match?.leader_party_color || "#EAEAEC"}
                        stroke="#D6D6DA"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            outline: "none",
                            stroke: "#000",
                            strokeWidth: 1,
                          },
                          pressed: { outline: "none" },
                        }}
                        data-tooltip-id="map-tooltip"
                        data-tooltip-content={
                          match
                            ? `${geoName}: ${match.leader_party} (+${match.vote_margin})`
                            : `${geoName}: No Data`
                        }
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            <Tooltip id="map-tooltip" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
