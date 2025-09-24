-- Create function to get fixtures data from fixtures_results_2526 table
CREATE OR REPLACE FUNCTION public.get_fixtures_data()
RETURNS TABLE (
  matchweek bigint,
  match_number bigint,
  match_date_utc timestamptz,
  match_datetime_london timestamptz,
  home_score bigint,
  away_score bigint,
  season text,
  competition text,
  home_team text,
  away_team text,
  venue text,
  status text,
  result text,
  source text
)
LANGUAGE sql
STABLE
AS $function$
  SELECT 
    matchweek,
    match_number,
    match_date_utc,
    match_datetime_london,
    home_score,
    away_score,
    season,
    competition,
    home_team,
    away_team,
    venue,
    status,
    result,
    source
  FROM fixtures_results_2526 
  ORDER BY match_date_utc ASC;
$function$;