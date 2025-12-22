import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CardActions,
    Grid,
} from "@mui/material";
import { searchDestinations } from "../api/destination.api";
import { DestinationGuide } from "../types/destination";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";

export const Destinations = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DestinationGuide[]>([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        const res = await searchDestinations(query);
        setResults(res.data.destinationGuides);
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    Explore Destinations
                </Typography>

                {/* Search */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 9 }}>
                        <TextField
                            fullWidth
                            label="Search destination"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>

                {/* Results */}
                <Grid container spacing={3}>
                    {results.map((d) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={d._id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6">{d.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {d.summary}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/destinations/${d._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Layout>
    );
};