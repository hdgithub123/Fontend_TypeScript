const zoneId = '98dc9cee-87f8-11f0-9b37-0242ac110002'; 
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