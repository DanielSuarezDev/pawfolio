import React, { useState } from 'react';
import { Animal, useAnimalForm } from '@/Hook/useAnimal';

export const AddAnimal = () => {
  const { register, handleSubmit, createAnimal } = useAnimalForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
console.log('photoFile', photoFile)
  const onSubmit = (data: any) => {
    if (photoFile) {
      createAnimal({ ...data, photo: photoFile });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input {...register("birthDate")} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input {...register("breed")} placeholder="Breed" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <select {...register("gender")} className="w-full px-3 py-2 border border-gray-300 rounded-md">
        <option value="">Select gender...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input 
        type="file" 
        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
        {...register("photo")}
        onChange={e => setPhotoFile(e.target.files ? e.target.files[0] : null)} 
      />
      <select {...register("type")} className="w-full px-3 py-2 border border-gray-300 rounded-md">
        <option value="">Select type...</option>
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </select>
      <button type="submit" className="w-full px-3 py-2 bg-blue-600 text-white rounded-md">Submit</button>
    </form>
  );
};


export default AddAnimal;
