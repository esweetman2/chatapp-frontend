import { useEffect, useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useUserContext } from '../src/Context/UserContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PlaidLogin() {
  const [linkToken, setLinkToken] = useState(null);
  const { user } = useUserContext();
  const userId = user?.id

  useEffect(() => {
    async function fetchLinkToken() {
      const res = await fetch(`${API_BASE_URL}/plaid/create_link_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId?.toString() }),
      });
      const data = await res.json();
    //   console.log(data)
      setLinkToken(data.link_token);
    }
    fetchLinkToken();
  }, [userId]);

  const onSuccess = useCallback(async (public_token: any, metadata: any) => {
    // send token to backend for exchange
    // console.log(public_token, metadata)
    await fetch(`${API_BASE_URL}/plaid/exchange_public_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token: public_token, user_id: userId?.toString(), metadata: metadata }),
    });

    // optional: refresh UI, fetch accounts, etc.
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: (err, metadata) => {
        console.log("Error: ", err)
        console.log("Metadata: ", metadata)

      // handle exits/errors
      // err can be null when user exits normally
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Connect a bank account
    </button>
  );
}
