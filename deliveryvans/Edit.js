import React, { useState, useEffect } from 'react';
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
  Tooltip,
  IconButton,
  MenuItem,
  Typography,
} from '@material-ui/core';
import wait from '../../../utils/wait';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileDropzone from '../../FileDropzone';
import XIcon from '../../../icons/X';
import DeleteIcon from '@material-ui/icons/Delete';
import ButtonComponent from '../../widgets/buttons/ButtonComponent';


const MenuCreateForm = (props) => {
  const { singlevandata, temp, UserName, ...other } = props;
  const bool = singlevandata.active || "";
  const oldImage = singlevandata.imageUrl || "";
  const [RadioValue, setRadioValue] = useState('true');
  const [oldImageUrl, setOldImageUrl] = useState('empty');
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [apiImage, setApiImage] = useState('');
  const boolValue = true;
  console.log("UserName", UserName.length);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [age, setAge] = useState(singlevandata.driverId !== 0 ? singlevandata.driverId : '');
  useEffect(() => {
    setAge(singlevandata.driverId);
  }, [singlevandata]);
  const handleChangeSelect = (event) => {
    // console.log("EVEnt", event.target.value);
    setAge(event.target.value);
  };

  // console.log("Delivery VAns", singlevandata);

  useEffect(() => {
    setOldImageUrl(oldImage || '');
  }, [oldImage]);
  useEffect(() => {
    setRadioValue(bool ? "true" : 'false' || '');
  }, [bool]);

  const onSelectFile = (e) => {
    if (files.length < 1) {
      if (!e.target.files || e.target.files.length === 0) {
       
        return;
      }
      else {
        const fileData = e.target.files[0];
        const resp = axios.post('https://mi.duceapps.com/api/v1/files', fileData)
          .then(response => {
            if (response.status === 200) {
              setApiImage(response.data.uri);
              setTimeout(() => {
                toast.success("Image Uploaded");
              }, 500);
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
    toast.error("Image Removed");
    setApiImage('');
    setOldImageUrl(oldImage);
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };
  const imageString = apiImage.toString();

  // console.log("Age", age);


  return (
    <Formik
      enableReinitialize={boolValue}
      initialValues={{
        imageUrl: "",
        color: singlevandata.color,
        driver: singlevandata.driverName,
        driverId: singlevandata.driverId,
        licensePlateNumber: singlevandata.licensePlateNumber,
        make: singlevandata.make,
        model: singlevandata.model,
        active: ''
      }}
      validationSchema={Yup.object().shape({
        driver: Yup.string().max(255).required('Enter Your Name'),
        color: Yup.string(),
        imageUrl: Yup.string(),
        active: Yup.bool(),
        licensePlateNumber: Yup
          .string()
          .matches(/^([ A-Za-z]+)\-([0-9]+)$/, 'NOt Of Requiered Format')
          .required("Enter License Number "),
        make: Yup.string(),
        model: Yup.string(),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }) => {
        setButtonLoad(true);

        const status = RadioValue === 'true';
        console.log(status);
        values.active = status;
        values.imageUrl = imageString !== '' ? imageString : oldImageUrl.toString();
        values.driverId = age
        try {
          // NOTE: Make API request
          await wait(500);
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          // console.log('FormValues', values);
          axios.put(`https://mi.duceapps.com/api/v1/van/${temp}`, values)
            .then((response) => {
              if (response.status === 200) {
                toast.success('Delivery Van Updated');
                setButtonLoad(false);
                setTimeout(() => {
                  navigate('/dashboard/delivery-vans');
                }, 2000);
              }
              else {
                setButtonLoad(false);
                toast.error("Delivery Van Not Updated");
              }
            })
          axios.put(` https://mi.duceapps.com/api/v1/van/${temp}/status?status=${status}`);

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
          {...other}
        >
          <Box>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ mb: 3 }}>
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
                    <Box sx={{ mb: 3 }}>
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

                    <Box sx={{ mb: 3 }}>
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

                    {/** <Box sx={{ mb: 3 }}>
                      <TextField
                        error={Boolean(touched.driver && errors.driver)}
                        fullWidth
                        helperText={touched.driver && errors.driver}
                        label="Driver"
                        name="driver"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.driver}
                        variant="outlined"
                      />
                    </Box> */}

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        error={Boolean(touched.color && errors.color)}
                        fullWidth
                        helperText={touched.color && errors.color}
                        label="Color of Vehicle"
                        name="color"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.color}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      {UserName.length > 0 ? (
                        <TextField
                          fullWidth
                          label="Driver Name"
                          onChange={handleChangeSelect}
                          value={age || ""}
                          select
                          variant="outlined"
                        >
                          {
                            UserName.map(option => {
                              return (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.firstName} {option.lastName}
                                </MenuItem>
                              )
                            })
                          }
                        </TextField>
                      ) : (
                        <Typography>No Driver Found</Typography>
                      )}
                    </Box>
                    <Box>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Status</FormLabel>
                        <RadioGroup
                          row
                          aria-label="Status"
                          name="active"
                          value={RadioValue || "true"}
                          checked={true ? true : false}
                        >
                          <FormControlLabel
                            value="true"
                            onChange={(e) => setRadioValue(e.target.value)}
                            control={<Radio />}
                            label="Active"
                          />
                          <FormControlLabel
                            value="false"
                            onChange={(e) => setRadioValue(e.target.value)}
                            control={<Radio />}
                            label="InActive"
                          />
                        </RadioGroup>
                      </FormControl>

                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box>
                  <Card>
                    <CardHeader title="Upload Image" />
                    <CardContent>
                      {oldImageUrl ? (
                        <>
                          <img style={{ width: "100%", maxWidth: "100%", maxHeight: "400px", marginBottom: "10%" }} src={oldImageUrl} alt='' />
                          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}
                            onClick={() => setOldImageUrl("")}
                          >
                            Remove Images
                          </Button>
                        </>
                      ) :
                        <FileDropzone
                          accept="image/*"
                          files={files}
                          onDrop={handleDrop}
                          onRemove={handleRemove}
                          onRemoveAll={handleRemoveAll}
                          onChange={onSelectFile}
                        // onUpload={handleUpload}
                        />
                      }
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mt: 3,
                  }}
                >
                  <ButtonComponent text={"UPDATE"} buttonLoad={buttonLoad} isSubmitting={isSubmitting} />
                  {/**<Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    UPDATE
                  </Button>  */}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form >
      )
      }
    </Formik >
  );
};
export default MenuCreateForm;
