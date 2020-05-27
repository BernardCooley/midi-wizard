import { useState, useEffect } from 'react';
import firebase from '../firebase';

const useFirebaseCall = (initialValue, collectionName, orderBy, limit) => {
    const db = firebase.firestore();
    const collectionRef = db.collection(collectionName);
    const [state, setState] = useState(initialValue);
    const [error, setError] = useState(null);
    const [lastItem, setLastItem] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            await collectionRef.orderBy(orderBy).limit(limit).get().then(
                response => {
                    const data = response.docs.map(doc => doc.data());
                    setState(data);
                    setLastItem(data[data.length - 1][orderBy]);
                }
            );
        } catch (error) {
            setError(error);
        }
    };

    const getNextItems = async () => {
        if (state.length > 0) {
            try {
                await collectionRef.orderBy(orderBy).startAfter(lastItem).limit(limit).get().then(
                    response => {
                        const data = response.docs.map(doc => doc.data());
                        const concatData = [...state, ...data];
                        setState(concatData);
                        setLastItem(concatData[concatData.length - 1][orderBy]);
                    }
                );
            } catch (error) {
                setError(error);
            }
        }
    };

    return [state, error, getNextItems];
}

export default useFirebaseCall;