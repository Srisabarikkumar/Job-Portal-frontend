import { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  description: Yup.string().required("Description is required"),
  website: Yup.string().url("Invalid URL").required("Website is required"),
  location: Yup.string().required("Location is required"),
  file: Yup.mixed().test("fileSize", "File is too large", (value) => {
    if (!value) return true; // Allows empty
    return value.size <= 5000000; // 5MB limit
  }),
});

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const { singleCompany } = useSelector((store) => store.company);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  };

  useEffect(() => {
    if (singleCompany) {
      initialValues.name = singleCompany.name || "";
      initialValues.description = singleCompany.description || "";
      initialValues.website = singleCompany.website || "";
      initialValues.location = singleCompany.location || "";
    }
  }, [singleCompany]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("website", values.website);
    formData.append("location", values.location);
    if (values.file) {
      formData.append("file", values.file);
    }

    try {
      setSubmitting(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="flex items-center gap-5 p-8">
                <Button
                  onClick={() => navigate("/admin/companies")}
                  variant="outline"
                  className="flex items-center gap-2 text-gray-500 font-semibold"
                >
                  <ArrowLeft />
                  <span>Back</span>
                </Button>
                <h1 className="font-bold text-xl">Company Setup</h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Field name="name" as={Input} />
                  {errors.name && touched.name && (
                    <div className="text-red-500">{errors.name}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field name="description" as={Input} />
                  {errors.description && touched.description && (
                    <div className="text-red-500">{errors.description}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Field name="website" as={Input} />
                  {errors.website && touched.website && (
                    <div className="text-red-500">{errors.website}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Field name="location" as={Input} />
                  {errors.location && touched.location && (
                    <div className="text-red-500">{errors.location}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="file">Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                  />
                  {errors.file && touched.file && (
                    <div className="text-red-500">{errors.file}</div>
                  )}
                </div>
              </div>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompanySetup;
