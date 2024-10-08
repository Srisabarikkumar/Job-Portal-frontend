import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const SignupSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["candidate", "admin"], "Invalid role")
    .required("Role is required"),
  file: Yup.mixed().test("fileSize", "File is too large", (value) => {
    if (!value) return true; // Allowing empty file
    return value.size <= 5 * 1024 * 1024; // 5MB limit
  }),
});

const Signup = () => {
  // const [input, setInput] = useState({
  //   fullname: "",
  //   email: "",
  //   phoneNumber: "",
  //   password: "",
  //   role: "",
  //   file: "",
  // });
  // const { loading, user } = useSelector((store) => store.auth);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const changeEventHandler = (e) => {
  //   setInput({ ...input, [e.target.name]: e.target.value });
  // };
  // const changeFileHandler = (e) => {
  //   setInput({ ...input, file: e.target.files?.[0] });
  // };
  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(); //formdata object
  //   formData.append("fullname", input.fullname);
  //   formData.append("email", input.email);
  //   formData.append("phoneNumber", input.phoneNumber);
  //   formData.append("password", input.password);
  //   formData.append("role", input.role);
  //   if (input.file) {
  //     formData.append("file", input.file);
  //   }

  //   try {
  //     dispatch(setLoading(true));
  //     const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       withCredentials: true,
  //     });
  //     if (res.data.success) {
  //       navigate("/login");
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     dispatch(setLoading(false));
  //   }
  // };

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, []);
  // return (
  //   <div>
  //     <Navbar />
  //     <div className="flex items-center justify-center max-w-7xl mx-auto">
  //       <form
  //         onSubmit={submitHandler}
  //         className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
  //       >
  //         <h1 className="font-bold text-xl mb-5">Sign Up</h1>
  //         <div className="my-2">
  //           <Label>Full Name</Label>
  //           <Input
  //             type="text"
  //             value={input.fullname}
  //             name="fullname"
  //             onChange={changeEventHandler}
  //             placeholder="Full Name"
  //           />
  //         </div>
  //         <div className="my-2">
  //           <Label>Email</Label>
  //           <Input
  //             type="email"
  //             value={input.email}
  //             name="email"
  //             onChange={changeEventHandler}
  //             placeholder="example@gmail.com"
  //           />
  //         </div>
  //         <div className="my-2">
  //           <Label>Phone Number</Label>
  //           <Input
  //             type="text"
  //             value={input.phoneNumber}
  //             name="phoneNumber"
  //             onChange={changeEventHandler}
  //             placeholder="8080808080"
  //           />
  //         </div>
  //         <div className="my-2">
  //           <Label>Password</Label>
  //           <Input
  //             type="password"
  //             value={input.password}
  //             name="password"
  //             onChange={changeEventHandler}
  //             placeholder="Password"
  //           />
  //         </div>
  //         <div className="flex lg:flex-row md:flex-row flex-col  justify-between">
  //           <RadioGroup className="flex items-center gap-4 my-5">
  //             <div className="flex items-center space-x-2">
  //               <Input
  //                 type="radio"
  //                 name="role"
  //                 value="candidate"
  //                 checked={input.role === "candidate"}
  //                 onChange={changeEventHandler}
  //                 className="cursor-pointer"
  //               />
  //               <Label htmlFor="r1">candidate</Label>
  //             </div>
  //             <div className="flex items-center space-x-2">
  //               <Input
  //                 type="radio"
  //                 name="role"
  //                 value="admin"
  //                 checked={input.role === "admin"}
  //                 onChange={changeEventHandler}
  //                 className="cursor-pointer"
  //               />
  //               <Label htmlFor="r2">admin</Label>
  //             </div>
  //           </RadioGroup>
  //           <div className="flex items-center gap-2">
  //             <Label>Profile</Label>
  //             <Input
  //               accept="image/*"
  //               type="file"
  //               onChange={changeFileHandler}
  //               className="cursor-pointer"
  //             />
  //           </div>
  //         </div>
  //         {loading ? (
  //           <Button className="w-full my-4">
  //             {" "}
  //             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
  //           </Button>
  //         ) : (
  //           <Button type="submit" className="w-full my-4">
  //             Signup
  //           </Button>
  //         )}
  //         <span className="text-sm">
  //           Already have an account?{" "}
  //           <Link to="/login" className="text-blue-600">
  //             Login
  //           </Link>
  //         </span>
  //       </form>
  //     </div>
  //   </div>
  // );

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "file" && values[key]) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <Formik
          initialValues={{
            fullname: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            file: null,
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
              <h1 className="font-bold text-xl mb-5">Sign Up</h1>

              <div className="my-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Field name="fullname" as={Input} placeholder="Full Name" />
                {errors.fullname && touched.fullname && (
                  <div className="text-red-500">{errors.fullname}</div>
                )}
              </div>

              <div className="my-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  name="email"
                  as={Input}
                  type="email"
                  placeholder="example@gmail.com"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>

              <div className="my-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Field name="phoneNumber" as={Input} placeholder="8080808080" />
                {errors.phoneNumber && touched.phoneNumber && (
                  <div className="text-red-500">{errors.phoneNumber}</div>
                )}
              </div>

              <div className="my-2">
                <Label htmlFor="password">Password</Label>
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  placeholder="Password"
                />
                {errors.password && touched.password && (
                  <div className="text-red-500">{errors.password}</div>
                )}
              </div>

              <div className="flex lg:flex-row md:flex-row flex-col justify-between">
                <RadioGroup className="flex items-center gap-4 my-5">
                  <div className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      name="role"
                      value="candidate"
                      as={Input}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="candidate">Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      name="role"
                      value="admin"
                      as={Input}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
                {errors.role && touched.role && (
                  <div className="text-red-500">{errors.role}</div>
                )}

                <div className="flex items-center gap-2">
                  <Label htmlFor="file">Profile</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    className="cursor-pointer"
                  />
                </div>
                {errors.file && touched.file && (
                  <div className="text-red-500">{errors.file}</div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full my-4"
                disabled={isSubmitting || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>

              <span className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600">
                  Login
                </Link>
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
