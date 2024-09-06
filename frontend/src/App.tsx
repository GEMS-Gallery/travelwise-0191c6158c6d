import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type Recommendation = {
  activity: string;
  place: string;
  accommodation: string;
};

type TravelInfo = {
  description: string;
  climate: string;
  bestTimeToVisit: string;
};

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: { destination: string }) => {
    setLoading(true);
    try {
      const result = await backend.getRecommendations(data.destination);
      if ('ok' in result) {
        setRecommendations(result.ok);
      } else {
        console.error('Error fetching recommendations:', result.err);
        setRecommendations(null);
      }

      const infoResult = await backend.getTravelInfo(data.destination);
      if ('ok' in infoResult) {
        setTravelInfo(infoResult.ok);
      } else {
        console.error('Error fetching travel info:', infoResult.err);
        setTravelInfo({ description: "No information available", climate: "Unknown", bestTimeToVisit: "Any time" });
      }
    } catch (error) {
      console.error('Error:', error);
      setRecommendations(null);
      setTravelInfo({ description: "Error fetching information", climate: "Unknown", bestTimeToVisit: "Any time" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Travel-Wise Assistant
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <Controller
              name="destination"
              control={control}
              defaultValue=""
              rules={{ required: 'Destination is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Enter your destination"
                  variant="outlined"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Get Recommendations
            </Button>
          </Grid>
        </Grid>
      </form>

      {loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}

      {recommendations && (
        <>
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Recommendations
          </Typography>
          <Grid container spacing={2}>
            {recommendations.map((rec, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {rec.activity}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {rec.place}
                    </Typography>
                    <Typography variant="body2">
                      Stay at: {rec.accommodation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {travelInfo && (
        <>
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Travel Information
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {travelInfo.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Climate:</strong> {travelInfo.climate}
              </Typography>
              <Typography variant="body1">
                <strong>Best Time to Visit:</strong> {travelInfo.bestTimeToVisit}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}

export default App;
