import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const validationSchema = yup.object({
    firstName: yup
        .string()
        .max(50, 'Your First Name must be under 50 characters'
        )
        .required('Please enter your first name.'),
    lastName: yup
        .string()
        .max(50, 'Your Last Name must be under 50 characters')
        .required('Please enter your last name.'),
  });


const UserProfile = () => {
    const user = useRouteLoaderData('root');

    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true)
            const postData = async () => {
              const token = localStorage.getItem('token');
              const userId = localStorage.getItem('id');
              try {
                const response = await axios.post(`http://192.168.1.58:5000/users/${userId}`, values, {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                })
                setIsLoading(false)
                if(response.status === 200) {
                  alert(response.data)
                  navigate('/')

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
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
      <p style={{color: 'red'}} >{errMessage}</p>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            defaultValue={user.email}
            disabled
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Update
      </Button>
    </Box>      
    );

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
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          {isLoading ? <CircularProgress /> : form}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserProfile;