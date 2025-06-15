import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class IpifyService {
  private static createAxiosInstance(baseUrl: string | undefined) {
    return axios.create({
      baseURL: baseUrl,
    });
  }

  static get AxiosServiceIpify() {
    const baseUrl = process.env.NEXT_PUBLIC_API_IPIFY;
    return this.createAxiosInstance(baseUrl);
  }
}

export default IpifyService;
