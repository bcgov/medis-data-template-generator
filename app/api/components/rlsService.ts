export const getRLSHealthAuthorityHierarchy = async () => {
  const apiUrl = process.env.RLS_API_URL;
  const haFormId = process.env.RLS_HA_FORM_ID;
  const apiKey = process.env.RLS_API_KEY || "";
  try {
    // TODO: Move to Axios for consistency, currently only fetch works
    //  axios would throw an error saying too many redirects
    const response = await fetch(`${apiUrl}?extFormId=${haFormId}`, {
      headers: {
        Connection: "keep-alive",
        apiKey: apiKey,
        Application: "application/json",
      },
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.error("Error fetching RLS Health Authority Hierarchy", error);
    throw new Error("Error fetching RLS Health Authority Hierarchy");
  }
};
