import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    List,
    ListItem,
    Divider,
} from "@mui/material";
import { getDestinationById } from "../api/destination.api";
import { DestinationGuide } from "../types/destination";
import Layout from "../components/common/Layout";

const DestinationDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState<DestinationGuide | null>(null);

    useEffect(() => {
        if (id) {
            getDestinationById(id).then((res) => setData(res.data));
        }
    }, [id]);

    if (!data) return <p>Loading...</p>;

    return (
        <Layout>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    {data.title}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                    {data.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6">Top Attractions</Typography>
                <List>
                    {data.attractions?.map((a, i) => (
                        <ListItem key={i}>{a}</ListItem>
                    ))}
                </List>
            </Container>
        </Layout>
    );
};

export default DestinationDetails;
