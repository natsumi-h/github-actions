import { formAtom, FormType } from "../../state/form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAtom } from "jotai";

export const Thanks = () => {
  const router = useRouter();
  const [data] = useAtom<FormType>(formAtom);

  useEffect(() => {
    if (!data.lastName && !data.firstName && !data.email) {
      router.push("/contact");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>Thanks!</>;
};

export default Thanks;
