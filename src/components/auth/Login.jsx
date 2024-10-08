/* eslint-disable react/no-unescaped-entities */
import { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string()
    .oneOf(["candidate", "admin"], "Invalid role")
    .required("Role is required"),
});

const Login = () => {
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
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
            email: "",
            password: "",
            role: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
              <h1 className="font-bold text-xl mb-5">Login</h1>

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

              <div className="flex items-center justify-between">
                <RadioGroup className="flex items-center gap-4">
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
              </div>
              {errors.role && touched.role && (
                <div className="text-red-500">{errors.role}</div>
              )}

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
                  "Login"
                )}
              </Button>

              <span className="text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600">
                  Signup
                </Link>
              </span>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
