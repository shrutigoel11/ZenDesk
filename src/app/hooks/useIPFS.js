// Create a new file named useIPFS.js in your src/app/hooks directory
import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';

export function useIPFS() {
  const [ipfs, setIpfs] = useState(null);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
    const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });

    setIpfs(client);
  }, []);

  return ipfs;
}