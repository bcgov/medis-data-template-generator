import env from "../utils/env";

export const getRLSHealthAuthorityHierarchy = async (payload: any) => {
  const apiUrl = env.RLS_API_URL;
  const haFormId = env.RLS_HA_FORM_ID;
  const apiKey = env.RLS_API_KEY || "";
  try {
    console.log(payload);
    const userGuid = payload.idir_user_guid || payload.bceid_user_guid;

    // TODO: Move to Axios for consistency, currently only fetch works
    //  axios would throw an error saying too many redirects
    const response = await fetch(`${apiUrl}?extFormId=${haFormId}`, {
      headers: {
        Connection: "keep-alive",
        apiKey: apiKey,
        Application: "application/json",
        "x-chefs-user-userid": userGuid,
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
    const userGuid = payload.idir_user_guid || payload.bceid_user_guid;
    // TODO: Move to Axios for consistency, currently only fetch works
    //  axios would throw an error saying too many redirects
    const response = await fetch(`${apiUrl}?extFormId=${roleFormId}`, {
      headers: {
        Connection: "keep-alive",
        apiKey: apiKey,
        Application: "application/json",
        "x-chefs-user-userid": userGuid,
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching RLS Role", error);
        throw new Error("Error fetching RLS Role");
      });

    console.log(response);

    if (response.length === 0) {
      throw new Error("User does not have a role or has multiple roles");
    }

    response.forEach((role: any) => {
      if (!role.role) {
        throw new Error("Role not found");
      }
    });

    return response;
  } catch (error) {
    console.error("Error fetching RLS Role", error);
    throw new Error("Error fetching RLS Role");
  }
};
