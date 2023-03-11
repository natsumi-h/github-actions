import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formAtom, FormType } from "../../state/form";
import { useAtom } from "jotai";
import { useState } from "react";
import { MICROCMS_TOKEN } from "../../lib/client";

const schema = z
  .object({
    firstName: z.string().min(1, "Firstnameは必須です！"),
    lastName: z.string().min(1, "Lastnameは必須です！"),
    email: z.string().email("正しいメールアドレスを入力してください"),
    emailConfirmation: z
      .string()
      .email("正しいメールアドレスを入力してください"),
    newsletterRegistration: z.boolean(),
  })
  .refine((data) => data.email === data.emailConfirmation, {
    message: "メールアドレスが一致しません",
    path: ["emailConfirmation"],
  })
  .refine((data) => data.newsletterRegistration, {
    message: "ニュースレターに登録しない場合はご応募頂けません",
    path: ["newsletterRegistration"],
  });

type Form = z.infer<typeof schema>;

type GetResData = {
  email: string;
};

export const Contact = () => {
  const router = useRouter();
  const [_, setData] = useAtom(formAtom);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<Form>({ resolver: zodResolver(schema), mode: "onBlur" });

  const [errorMessage, setErrorMessage] = useState<null | string>();
  const onSubmit = async (data: Form) => {
    setErrorMessage(null);
    try {
      const getRes = await fetch(
        "https://natsumih-blog.microcms.io/api/v1/contact",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-MICROCMS-API-KEY": `${MICROCMS_TOKEN}`,
          },
        }
      );
      const getResData = await getRes.json();
      const ifDuplicateEmail = await getResData.contents.some(
        (element: GetResData) => element.email === data.email
      );
      if (ifDuplicateEmail) {
        throw Error("既に同じメールアドレスで登録されています");
      } else {
        router.push("contact/confirmation");
        const { email, firstName, lastName } = data;
        setData({
          email,
          firstName,
          lastName,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="inline-first-name"
          >
            First Name
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-first-name"
            type="text"
            // value="Jane"
            placeholder="Jane"
            {...register("firstName")}
          />
          <p>{errors.firstName?.message}</p>
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="inline-last-name"
          >
            Last Name
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-last-name"
            type="text"
            // value="Doe"
            placeholder="Doe"
            {...register("lastName")}
          />
          <p>{errors.lastName?.message}</p>
          {/* {errors.lastName && <p>{errors.lastName.message}</p>} */}
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="inline-email"
          >
            Email
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-email"
            type="email"
            placeholder="test@test.com"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="inline-emailConfirmation"
          >
            Email<br></br>(Confirmation)
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-emailConfirmation"
            type="email"
            placeholder="test@test.com"
            {...register("emailConfirmation")}
          />
          <p>{errors.emailConfirmation?.message}</p>
        </div>
      </div>
      <div className="md:flex items-center mb-6">
        <div className="md:w-1/3"></div>
        <label className="md:w-2/3 block text-gray-500 font-bold">
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            {...register("newsletterRegistration")}
          />
          <span className="text-sm">Send me your newsletter!</span>
          <p>{errors.newsletterRegistration?.message}</p>
        </label>
      </div>

      <div className="md:flex md:items-center">
        {/* <div className="md:w-1/3"></div>
        <div className="md:w-2/3"> */}
        <button
          className={`w-full md:w-3/4 block mx-auto shadow ${
            !isValid ? "bg-purple-400" : "bg-purple-500"
          } hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
          type="submit"
          // disabled={!isValid}
        >
          Submit
        </button>

        {/* </div> */}
      </div>
      <p className="w-full md:w-3/4 block mx-auto mt-4">
        {errorMessage && errorMessage}
      </p>
      <p>
        やったこと<br></br>
        zod<br></br>
        メール重複エラー<br></br>
        確認ページ＆サンクスページは直アクセスの場合はリダイレクトさせる
      </p>
    </form>
  );
};

export default Contact;
