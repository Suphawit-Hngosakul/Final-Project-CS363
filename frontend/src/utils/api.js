import axios from 'axios';

export const BASE = 'http://localhost:8080';

export const imgSrc = (image) => image.startsWith('http') ? image : `${BASE}${image}`;

export const call = async (method, path, data, token, isForm = false) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && data) headers['Content-Type'] = 'application/json';
  
  const res = await axios({
    method,
    url: `${BASE}${path}`,
    data: isForm ? data : (data ? data : undefined),
    headers,
  });
  
  return res.data;
};
