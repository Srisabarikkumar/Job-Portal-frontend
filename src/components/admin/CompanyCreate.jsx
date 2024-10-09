import Navbar from "../shared/Navbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const validationSchema = Yup.object().shape({
  companyName: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(50, "Company name must be less than 50 characters")
    .required("Company name is required"),
});

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    companyName: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: values.companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create company. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to give your company name? You can change this
            later.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Label htmlFor="companyName">Company Name</Label>
              <Field
                as={Input}
                id="companyName"
                name="companyName"
                type="text"
                className="my-2"
                placeholder="JobHunt, Microsoft etc."
              />
              {errors.companyName && touched.companyName && (
                <div className="text-red-500">{errors.companyName}</div>
              )}

              <div className="flex items-center gap-2 my-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/companies")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Continue"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompanyCreate;
