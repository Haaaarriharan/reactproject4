import React, { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import wait from '../../../utils/wait';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileDropzone from '../../FileDropzone';
import ButtonComponent from '../../widgets/buttons/ButtonComponent';

const MenuCreateForm = (props) => {
  const { StaffData, UserName, ...others } = props;
  // const StaffData1 = StaffData || ["1", "2", "3"];
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [RadioValue, setActive] = useState('');
  const [apiImage, setApiImage] = useState('');
  //console.log("PROPS", StaffData);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [age, setAge] = useState("1");

  const handleChangeSelect = (event) => {
    // console.log("EVEnt", event.target.value);
    setAge(event.target.value);
  };

  //____________________IMAGE UPLOAD CODE___________________________________
  const onSelectFile = (e) => {
    if (files.length < 1) {

      if (!e.target.files || e.target.files.length === 0) {
        
        return;
      }
      else {
        const fileData = e.target.files[0];
        //console.log('comes to else part', fileData);
        const resp = axios.post('https://mi.duceapps.com/api/v1/files', fileData)
          .then(response => {
            console.log('Response', response.status);
            if (response.status === 200) {
              setApiImage(response.data.uri);
              setTimeout(() => {
                toast.success("Image Uploaded");
              }, 1000);
            }
          });
      }
    }
    else {
      console.log("CANNOT UPLOAD IMAGE");
    }
  };

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  useEffect(() => {
    if (files.length > 1) {
      toast.error("Maximum 1 image can be Uploaded");
      files.splice(1, 1);
    }
  }, [files]);

  const handleRemove = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_file) => _file.path !== file.path)
    );
    setApiImage('');
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };
  //____________________________________________________________
  const imageString = apiImage.toString();
  // const selectedUser = StaffData.filter((item) => item.firstName === age);
  //console.log("SelectedUser", selectedUser);

  return (
    <Formik
      initialValues={{
        driverId: "",
        imageUrl: "",
        color: "",
        licensePlateNumber: '',
        make: "",
        model: '',
      }}
      validationSchema={Yup.object().shape({
        make: Yup.string().max(255),
        color: Yup.string(),
        licensePlateNumber: Yup
          .string()
          .matches(/^([ A-Za-z]+)\-([0-9]+)$/, 'NOt Of Requiered Format')
          .required("Enter License Number "),
        model: Yup.string(),
        imageUrl: Yup.string(),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }) => {
        setButtonLoad(true);
        values.imageUrl = imageString;
        values.driverId = Number(age);
        // console.log(values.driverId);
        try {
          // NOTE: Make API request
          await wait(500);
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          console.log('FormValues', values);
          setActive('');
          setApiImage('');
          axios.post('https://mi.duceapps.com/api/v1/van', values)
            .then((response) => {
              if (response.status === 200) {
                toast.success('Delivery Van Created');
                setButtonLoad(false);
                setTimeout(() => {
                  navigate('/dashboard/delivery-vans');
                }, 2000);
              }
              else {
                setButtonLoad(false);
                toast.error("Delivery Van Not Created");
              }
            })
        } catch (err) {
          console.error(err);
          toast.error('Something went wrong!');
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form
          onSubmit={handleSubmit}
          noValidate
          {...others}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{ mb: 2 }}
                  >
                    {StaffData !== '' ? (
                      <TextField
                        fullWidth
                        label="Driver Name"
                        required
                        onChange={handleChangeSelect}
                        value={age || ""}
                        select
                        variant="outlined"
                      >
                        {
                          StaffData.map(option => {
                            return (
                              <MenuItem key={option.id} value={option.id}>
                                {option.firstName} {option.lastName}
                              </MenuItem>
                            )
                          })
                        }
                      </TextField>
                    ) : (
                      <Typography>Empty Values</Typography>
                    )}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      error={Boolean(touched.model && errors.model)}
                      fullWidth
                      helperText={touched.model && errors.model}
                      label="Model"
                      name="model"
                      type="text"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.model}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      error={Boolean(touched.licensePlateNumber && errors.licensePlateNumber)}
                      fullWidth
                      helperText={touched.licensePlateNumber && errors.licensePlateNumber}
                      label="License Plate Number"
                      name="licensePlateNumber"
                      type="text"
                      required
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.licensePlateNumber}
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      error={Boolean(touched.color && errors.color)}
                      fullWidth
                      helperText={touched.color && errors.color}
                      label="Color of Vehicle"
                      name="color"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.color}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      error={Boolean(touched.make && errors.make)}
                      fullWidth
                      helperText={touched.make && errors.make}
                      label="Make"
                      name="make"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.make}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box >
                <Card>
                  <CardHeader title="Upload Image" />
                  <CardContent>
                    <FileDropzone
                      accept="image/*"
                      files={files}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      // onUpload={handleUpload}
                      onRemoveAll={handleRemoveAll}
                      onChange={onSelectFile}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <ButtonComponent text={"ADD"} buttonLoad={buttonLoad} isSubmitting={isSubmitting} />
                {/**<Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  ADD
                </Button>  */}
              </Box>
            </Grid>
          </Grid>
        </form>
      )
      }
    </Formik >
  );
};
export default MenuCreateForm;