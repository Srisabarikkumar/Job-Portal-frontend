/* eslint-disable no-unused-vars */
import Navbar from "../shared/Navbar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const companyArray = [];

const JobSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  requirements: Yup.string().required("Requirements are required"),
  salary: Yup.string().required("Salary is required"),
  location: Yup.string().required("Location is required"),
  jobType: Yup.string().required("Job type is required"),
  experience: Yup.string().required("Experience level is required"),
  position: Yup.number()
    .positive("Position must be positive")
    .integer("Position must be an integer")
    .required("Number of positions is required"),
  companyId: Yup.string().required("Company is required"),
});

const PostJob = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const initialValues = {
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/post`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <Formik
          initialValues={initialValues}
          validationSchema={JobSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Field
                    name="title"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500">{errors.title}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field
                    name="description"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500">{errors.description}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Field
                    name="requirements"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.requirements && touched.requirements && (
                    <div className="text-red-500">{errors.requirements}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Field
                    name="salary"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.salary && touched.salary && (
                    <div className="text-red-500">{errors.salary}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Field
                    name="location"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.location && touched.location && (
                    <div className="text-red-500">{errors.location}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Field
                    name="jobType"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.jobType && touched.jobType && (
                    <div className="text-red-500">{errors.jobType}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Field
                    name="experience"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.experience && touched.experience && (
                    <div className="text-red-500">{errors.experience}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="position">No of Position</Label>
                  <Field
                    name="position"
                    type="number"
                    as={Input}
                    className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                  />
                  {errors.position && touched.position && (
                    <div className="text-red-500">{errors.position}</div>
                  )}
                </div>

                {companies.length > 0 && (
                  <div>
                    <Label htmlFor="companyId">Company</Label>
                    <Select
                      onValueChange={(value) => {
                        const selectedCompany = companies.find(
                          (company) =>
                            company.name.toLowerCase() === value.toLowerCase()
                        );
                        setFieldValue("companyId", selectedCompany._id);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((company, index) => (
                            <SelectItem key={index} value={company.name}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.companyId && touched.companyId && (
                      <div className="text-red-500">{errors.companyId}</div>
                    )}
                  </div>
                )}
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
                  "Post New Job"
                )}
              </Button>

              {companies.length === 0 && (
                <p className="text-xs text-red-600 font-bold text-center my-3">
                  *Please register a company first, before posting a job
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PostJob;
