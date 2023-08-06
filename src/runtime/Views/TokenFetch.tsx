export async function loadToken(credentials) {
    let formdata = new URLSearchParams();
    formdata.append("grant_type", "client_credentials");
    formdata.append("client_id", credentials.client_id);
    formdata.append("client_secret", credentials.client_secret);
    formdata.append("scope", "https://graph.microsoft.com/.default");

    let requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formdata,
    };

    const response = await fetch("https://login.microsoftonline.com/" + credentials.tenant_id + "/oauth2/v2.0/token", requestOptions);
    const token = await response.json();
    console.log("Updated the token");
    return token; // Here we are returning the token
}
