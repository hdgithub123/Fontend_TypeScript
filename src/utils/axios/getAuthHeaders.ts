const zoneId = '8e522402-3611-11f0-b432-0242ac110002';
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${token}`,
    zone: zoneId,
    is_child_zone: true
  };
};

export default getAuthHeaders;