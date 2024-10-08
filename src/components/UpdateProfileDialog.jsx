/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const ProfileSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  bio: Yup.string().required("Bio is required"),
  skills: Yup.string().required("Skills are required"),
  file: Yup.mixed().test("fileType", "Only PDF files are allowed", (value) => {
    if (!value) return true; // Allow empty file
    return value && ["application/pdf"].includes(value.type);
  }),
});

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const initialValues = {
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "file" && values[key]) {
        formData.append(key, values[key]);
      } else if (key === "skills") {
        formData.append(
          key,
          values[key].split(",").map((skill) => skill.trim())
        );
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullname" className="text-right">
                    Name
                  </Label>
                  <Field name="fullname" as={Input} className="col-span-3" />
                  {errors.fullname && touched.fullname && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.fullname}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Field
                    name="email"
                    as={Input}
                    type="email"
                    className="col-span-3"
                  />
                  {errors.email && touched.email && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">
                    Number
                  </Label>
                  <Field name="phoneNumber" as={Input} className="col-span-3" />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Bio
                  </Label>
                  <Field name="bio" as={Input} className="col-span-3" />
                  {errors.bio && touched.bio && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.bio}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skills" className="text-right">
                    Skills
                  </Label>
                  <Field name="skills" as={Input} className="col-span-3" />
                  {errors.skills && touched.skills && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.skills}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    Resume
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    className="col-span-3"
                  />
                  {errors.file && touched.file && (
                    <div className="col-span-3 col-start-2 text-red-500">
                      {errors.file}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full my-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
