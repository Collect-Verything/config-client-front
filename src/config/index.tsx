import React, {useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography,} from "@mui/material";
import Compact from "@uiw/react-color-compact";

const host = import.meta.env.VITE_APP_HOST;

export type SiteConfig = {
    titreSite: string;
    user: string;
    primary: string;
    secondary: string;
};

type Field = {
    label: string;
    type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    value: string;
    setter: React.Dispatch<React.SetStateAction<string>>;
};


export default function SimpleSiteConfigForm() {
    const [titreSite, setTitreSite] = useState("Ma Boutique");
    const [user, setUser] = useState("contact@example.com");
    const [primary, setPrimary] = useState("#0ea5e9");
    const [secondary, setSecondary] = useState("#0ea5e9");
    const [preview, setPreview] = useState<SiteConfig | null>(null);
    const [displayWebsite, setDisplayWebsite] = useState(false);
    const [deploymentStatus, setDeploymentStatus] = useState<"not-started" | "pending" | "ok" | "ko">("not-started");


    const fields: Field[] = [
        {label: "Nom de la boutique", type: "text", value: titreSite, setter: setTitreSite},
        {label: "Email de contact", type: "email", value: user, setter: setUser},
    ];

    function buildPayload(): SiteConfig {
        return {
            primary,
            secondary,
            titreSite,
            user,
        };
    }


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPreview(buildPayload());

        setDeploymentStatus("pending")

        fetch(`https://api.github.com/repos/${import.meta.env.VITE_APP_GIT_OWNER}/${import.meta.env.VITE_APP_GIT_REPO}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_APP_GIT_BEARER_PAT}`,
            },
            body: JSON.stringify({
                event_type: "deploy-site",
                client_payload: {
                    primary,
                    secondary,
                    titreSite,
                    user,
                },
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error(`Erreur GitHub API: ${res.status}`);
                setDeploymentStatus("ko")
                return res.text();
            })
            .then(console.log)
            .catch(console.error);
        setDeploymentStatus("ok")
        setDisplayWebsite(true);
    }

    return (
        <Box sx={{minHeight: "100vh", bgcolor: "#f8fafc", py: 6, px: 2}}>
            <Box sx={{mx: "auto"}}>
                <Typography variant="h5" color="black" fontWeight={700} gutterBottom>
                    Configuration de votre site
                </Typography>
                <Card>
                    <CardHeader title="Informations"/>
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={2}>

                                <Grid container spacing={2}>
                                    {fields.map(({label, type, value, setter}, idx) => (
                                        <Grid key={idx}>
                                            <TextField
                                                fullWidth
                                                type={type}
                                                label={label}
                                                value={value}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)}
                                                required={type !== "color"}
                                                // InputLabelProps={type === "color" ? {shrink: true} : undefined}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid>
                                        <Typography>Couleur primaire:</Typography>
                                        <Compact color={primary} onChange={(color) => {
                                            setPrimary(color.hex);
                                        }}/>
                                    </Grid>

                                    <Grid>
                                        <Typography>Couleur secondaire:</Typography>
                                        <Compact color={secondary} onChange={(color) => {
                                            setSecondary(color.hex);
                                        }}/>
                                    </Grid>


                                </Grid>

                                <Grid>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button variant="contained" type="submit" disabled={deploymentStatus !== "not-started"}>
                                            Générer ma boutique
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>

                {displayWebsite &&
                    <Card sx={{mt: 3}}>
                        <CardHeader title="Consulter votre boutique"/>
                        <CardContent>
                            <Grid>
                                <Stack direction="row" justifyContent="center">
                                    <Button variant="contained" type="submit" component="a"
                                            href={`http://${host}`}
                                            target="_blank">
                                        Consulter votre boutique
                                    </Button>
                                </Stack>
                            </Grid>
                        </CardContent>
                    </Card>
                }

                {preview && (
                    <Card sx={{mt: 3}}>
                        <CardHeader title="Payload généré"/>
                        <CardContent>
                            <Box component="pre" sx={{p: 2, bgcolor: "#0f172a", color: "#e2e8f0", borderRadius: 2, overflowX: "auto"}}>
                                {JSON.stringify(preview, null, 2)}
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}