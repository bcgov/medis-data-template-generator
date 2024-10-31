import env from "../utils/env";

export const getRLSHealthAuthorityHierarchy = async (payload: any) => {
  const apiUrl = process.env.RLS_API_URL;
  const haFormId = process.env.RLS_HA_FORM_ID;
  const apiKey = process.env.RLS_API_KEY || "";
  try {
    console.log(payload);
    // TODO: Move to Axios for consistency, currently only fetch works
    //  axios would throw an error saying too many redirects
    const response = await fetch(`${apiUrl}?extFormId=${haFormId}`, {
      headers: {
        Connection: "keep-alive",
        apiKey: apiKey,
        Application: "application/json",
        "x-chefs-user-userid": payload.idir_user_guid,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching RLS Health Authority Hierarchy", error);
        throw new Error("Error fetching RLS Health Authority Hierarchy");
      });
    return response;
  } catch (error) {
    console.error("Error fetching RLS Health Authority Hierarchy", error);
    throw new Error("Error fetching RLS Health Authority Hierarchy");
  }
};

export const getRLSRole = async (payload: any) => {
  const apiUrl = env.RLS_API_URL;
  const roleFormId = env.RLS_ROLE_FORM_ID;
  const apiKey = env.RLS_API_KEY || "";
  try {
    const user_guid = payload.idir_user_guid || payload.bceid_user_guid;
    // TODO: Move to Axios for consistency, currently only fetch works
    //  axios would throw an error saying too many redirects
    const response = await fetch(`${apiUrl}?extFormId=${roleFormId}`, {
      headers: {
        Connection: "keep-alive",
        apiKey: apiKey,
        Application: "application/json",
        "x-chefs-user-userid": user_guid,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching RLS Role", error);
        throw new Error("Error fetching RLS Role");
      });

    if (response.length > 1) {
      console.log(response);
      throw new Error("User does not have a role or has multiple roles");
    }

    return response;
  } catch (error) {
    console.error("Error fetching RLS Role", error);
    throw new Error("Error fetching RLS Role");
  }
};
