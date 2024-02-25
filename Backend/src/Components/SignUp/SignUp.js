import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, set } from 'firebase/database';
import './SignUp.css';

export default function Signup() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Upload image to Firebase Storage
      const storageRef = getStorage();
      const imageRef = ref(storageRef, `Images/${data.id}.jpg`);
      await uploadBytes(imageRef, formData.image);

      // Save user data to Firebase Realtime Database
      const db = getDatabase();
      const studentRef = dbRef(db, 'Students/' + data.id);

      set(studentRef, {
        name: data.name,
        id: data.id,
        Department: data.department,
        AcademicYear: data.AcademicYear,
        email: data.email,
        // You may store the image URL or metadata in the database if needed
        // For now, we are storing only the student's information
      });

      console.log('User created successfully');
      setError('User created successfully');
      setFormVisible(false);

      setTimeout(() => {
        navigate('/student_dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error during sign-up:', error);

      if (error.message) {
        const errorMessage = error.message.split('Error (')[1]?.split(').')[0];
        setError(errorMessage || 'An error occurred during sign-up.');
      } else {
        setError('An unknown error occurred during sign-up.');
      }

      setFormVisible(true);
    }
  };

  const onImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setFormData({ ...formData, image: selectedImage });

    const previewURL = URL.createObjectURL(selectedImage);
    setImagePreview(previewURL);
  };

  return (
    <section>
      {error === 'User created successfully' && (<div class="success-checkmark">
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
            </div>
        </div>)}
      <div className={errors.name ? 'register register-error' : 'register'}>
        {formVisible && (<form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)} >
          {/* Form fields and error handling */}
          {error && <div className={error === 'User created successfully' ? 'error-msg success' : 'error-msg'}>{error}</div>}
          <input
            type="text"
            placeholder='Name'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}
          <input
            type="text"
            placeholder='Student ID'
            {...register('id', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}
          <input
            type="text"
            placeholder='Department'
            {...register('department', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}
          <input
            type="text"
            placeholder='Academic Year'
            {...register('AcademicYear', { required: 'Name is required' })}
          />
          {errors.name && <span className="error" style={{color: 'red'}}>{errors.name.message}</span>}

          <input
            type="text"
            placeholder='Email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && <span className="error" style={{color: 'red'}}>{errors.email.message}</span>}

          <input
            type="password"
            placeholder='Password'
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error" style={{color: 'red'}}>{errors.password.message}</span>}

          <input
            type="password"
            placeholder='Confirm Password'
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className="error" style={{color: 'red'}}>{errors.confirmPassword.message}</span>}
          <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
          />
          {errors.image && <span className="error" style={{ color: 'red' }}>{errors.image.message}</span>}
          {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}

          <button type="submit" className='btn'>Sign Up</button>
        </form>)}
        
      </div>
    </section>
  )
}
