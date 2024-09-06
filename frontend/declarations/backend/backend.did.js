export const idlFactory = ({ IDL }) => {
  const TravelInfo = IDL.Record({
    'climate' : IDL.Text,
    'bestTimeToVisit' : IDL.Text,
    'description' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Recommendation = IDL.Record({
    'accommodation' : IDL.Text,
    'place' : IDL.Text,
    'activity' : IDL.Text,
  });
  const Recommendations = IDL.Vec(Recommendation);
  const Result_1 = IDL.Variant({ 'ok' : Recommendations, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : TravelInfo, 'err' : IDL.Text });
  return IDL.Service({
    'addTravelInfo' : IDL.Func([IDL.Text, TravelInfo], [Result_2], []),
    'getRecommendations' : IDL.Func([IDL.Text], [Result_1], []),
    'getTravelInfo' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
