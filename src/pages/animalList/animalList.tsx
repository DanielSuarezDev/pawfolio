// AnimalList.js
import React from "react";
import { useAnimalForm } from "@/Hook/useAnimal";
import Image from "next/image";

export const AnimalList = () => {
  const { animals, setValue, updateAnimal, deleteAnimal } = useAnimalForm();

  const handleEdit = (animal) => {
    for (let key in animal) {
      setValue(key, animal[key]);
    }
  };

  console.log("animals", animals);

  return (
    <div className="space-y-4">
      {animals.map((animal) => (
        <div
          key={animal.id}
          className="p-4 border border-gray-300 rounded-md space-y-2"
        >
          <Image src={animal.photo} width={200} height={200} alt="animal" />
          <div>Name: {animal.name}</div>
          <div>Birth Date: {animal.birthDate}</div>
          <div>
            <button
              onClick={() => handleEdit(animal)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => deleteAnimal(animal.id)}
              className="px-3 py-2 bg-red-600 text-white rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimalList;
