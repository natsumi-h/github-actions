import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formAtom, FormType } from "../../state/form";
import { MICROCMS_TOKEN } from "../../lib/client";

export const Confirmation = () => {
  const [data] = useAtom<FormType>(formAtom);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!data.lastName && !data.firstName && !data.email) {
      router.push("/contact");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const postRes = await fetch(
        "https://natsumih-blog.microcms.io/api/v1/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-MICROCMS-API-KEY": `${MICROCMS_TOKEN}`,
          },
          body: JSON.stringify({
            name: data.firstName,
            email: data.email,
          }),
        }
      );
      const postResData = await postRes.json();
      console.log(postResData);
      console.log("posted");
      router.push("/contact/thanks");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      <p>first name : {data?.firstName}</p>
      <p>last name : {data?.lastName}</p>
      <p>email : {data?.email}</p>
      <form onSubmit={onSubmit}>
        <button
          className="w-full md:w-3/4 block mx-auto shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
      <p>{errorMessage && errorMessage}</p>
    </>
  );
};

export default Confirmation;
