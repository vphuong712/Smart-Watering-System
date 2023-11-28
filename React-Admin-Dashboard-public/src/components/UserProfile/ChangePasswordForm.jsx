import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const validationSchema = yup.object({
    currentPassword: yup.string().required('Please enter your password.'),
    newPassword: yup.string().min(8, 'Your password must be at least 8 characters!').required('Please enter your password.'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Password incorrect.').required('Please enter your password'),
  });

const ChangePasswordForm = () => {
    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          setIsLoading(true)
          const postData = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            try {
              const response = await axios.post(`http://192.168.1.58:5000/users/${userId}/change-password`, values, {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              })
              setIsLoading(false)
              if(response.status === 200) {
                alert(response.data)
              }
            } catch (error) {
              setIsLoading(false)
              setErrMessage(error.response.data);
            }
          }
          postData();
        },
    });

    const form = (
      <Box onSubmit={formik.handleSubmit} component="form" noValidate sx={{ mt: 1 }}>
        <p style={{color: 'red'}} >{errMessage}</p>
        <TextField
          margin="normal"
          required
          fullWidth
          id="currentPassword"
          label="Current Password"
          name="currentPassword"
          type="password"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
          helperText={formik.touched.currentPassword && formik.errors.currentPassword}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="newPassword"
          type="password"
          label="New Password"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword&& formik.errors.newPassword}
        />            
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>      
    )



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          {isLoading ? <CircularProgress/> : form}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ChangePasswordForm;