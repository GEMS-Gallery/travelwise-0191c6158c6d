import Nat "mo:base/Nat";
import Time "mo:base/Time";

import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";

actor {
  type Recommendation = {
    activity: Text;
    place: Text;
    accommodation: Text;
  };

  type TravelInfo = {
    description: Text;
    climate: Text;
    bestTimeToVisit: Text;
  };

  type Recommendations = [Recommendation];

  stable var travelInfoStore : [(Text, TravelInfo)] = [];
  stable var tempRecommendationsStore : [(Text, Recommendations)] = [];
  var recommendationsCache = HashMap.HashMap<Text, Recommendations>(0, Text.equal, Text.hash);

  public func getRecommendations(destination: Text) : async Result.Result<Recommendations, Text> {
    switch (recommendationsCache.get(destination)) {
      case (?cachedRecommendations) {
        #ok(cachedRecommendations)
      };
      case null {
        let newRecommendations = generateRecommendations(destination);
        recommendationsCache.put(destination, newRecommendations);
        #ok(newRecommendations)
      };
    };
  };

  public func addTravelInfo(destination: Text, info: TravelInfo) : async Result.Result<(), Text> {
    travelInfoStore := Array.append(travelInfoStore, [(destination, info)]);
    #ok(())
  };

  public func getTravelInfo(destination: Text) : async Result.Result<TravelInfo, Text> {
    switch (Array.find<(Text, TravelInfo)>(travelInfoStore, func((dest, _)) { dest == destination })) {
      case (?found) { #ok(found.1) };
      case null { #err("Travel info not found for " # destination) };
    };
  };

  func generateRecommendations(destination: Text) : Recommendations {
    // This is a placeholder function. In a real application, this would contain logic to generate recommendations.
    [
      { activity = "Visit " # destination # " Museum"; place = destination # " City Center"; accommodation = "Hotel " # destination },
      { activity = "Explore " # destination # " Park"; place = destination # " Nature Reserve"; accommodation = "Hostel " # destination },
      { activity = "Try local cuisine"; place = destination # " Food Market"; accommodation = "Airbnb in " # destination }
    ]
  };

  system func preupgrade() {
    // Convert HashMap to array for stable storage
    tempRecommendationsStore := Iter.toArray(recommendationsCache.entries());
  };

  system func postupgrade() {
    // Reinitialize HashMap from stable array
    for ((destination, recommendations) in tempRecommendationsStore.vals()) {
      recommendationsCache.put(destination, recommendations);
    };
  };
}
