import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { db, app, storage } from "@/Config/firebase";
import {
  doc,
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getStorage,
  uploadBytes,
} from "firebase/storage";

export interface Animal {
  name: string;
  birthDate: string;
  breed: string;
  gender: "male" | "female";
  type: "cat" | "dog";
}

interface FormData extends Animal {
  photo: any;
}

export const useAnimalForm = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "animals"), (snapshot) => {
      const newAnimals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Animal),
      }));

      setAnimals(newAnimals);
    });

    return () => unsubscribe();
  }, []);

  const uploadPhoto = async (imageFile: File): Promise<string> => {
    const storageInstance = getStorage();
    const imageRef = ref(storageInstance, `imagesAvatarAnimals/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageURL = await getDownloadURL(imageRef);
    return imageURL;
  };

  const createAnimal = async (data: FormData) => {
    console.log('data', data.photo[0])
    try {
      const photoUrl = await uploadPhoto(data.photo[0]);
      await addDoc(collection(db, "animals"), { ...data, photo: photoUrl });
      console.log("Animal created successfully!");
      reset();
    } catch (error) {
      console.error("Error creating animal: ", error);
    }
  };

  const updateAnimal = async (id: string, data: FormData) => {
    try {
      const photoUrl = await uploadPhoto(data.photo);
      await setDoc(doc(db, "animals", id), { ...data, photo: photoUrl});
      console.log("Animal updated successfully!");
      reset();
    } catch (error) {
      console.error("Error updating animal: ", error);
    }
  };
  
  const deleteAnimal = async (id: string) => {
    try {
      const animalDoc = await getDoc(doc(db, "animals", id));
      if (animalDoc.exists()) {
        const animalData = animalDoc.data() as FormData;
        if (animalData.photo) {
          const photoRef = ref(storage, animalData.photo);
          await deleteObject(photoRef);
        }
        await deleteDoc(doc(db, "animals", id));
        console.log("Animal deleted successfully!");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error deleting animal: ", error);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    animals,
    createAnimal: handleSubmit((data: FormData) => createAnimal(data)),
    updateAnimal: (id: string) =>
      handleSubmit((data: FormData) => updateAnimal(id, data)),
    deleteAnimal,
  };
};
