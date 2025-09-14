
import { getAuthHeaders, postData } from "../../../utils/axios";

interface organization {
  id?: string | null | undefined;
  code?: string;
  name?: string;
  address?: string;
  isActive?: boolean | string | number; // Allow boolean, string, or number
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}


interface OrganizationCheckResult {
  code?: boolean;
}



const checkOrganizationAvailability = async (
  { urlCheckOrganization = 'http://localhost:3000/auth/organization/check-organization',
    organization = {}
  }: {
    urlCheckOrganization?: string,
    organization: organization,
  }): Promise<OrganizationCheckResult> => {

  try {
    const fields: { [key: string]: any } = {};
    for (const key in organization) {
      if (organization[key] !== undefined) {
        fields[key] = organization[key];
      }
    }

    let myOrganizationCheck;
    if (!organization.id || organization.id === "") {
      myOrganizationCheck = { fields };
    } else {
      myOrganizationCheck = { fields, excludeField: "id" };
    }

    const res = await postData({
      url: urlCheckOrganization,
      data: myOrganizationCheck,
    });

    const result: { [key: string]: boolean } = {};
    for (const key in fields) {
      result[key] = res.data[key];
    }
    return result
  } catch (err) {
    console.error("Error checking organization:", err);
    return {};
  }
};

export default checkOrganizationAvailability;