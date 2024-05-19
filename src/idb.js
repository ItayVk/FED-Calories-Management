/*Itay Vekselbum, Dor Bergel, Eyal Avni*/


const idb = {
    db: null,
    openCaloriesDB: async function (dbName, versionNumber) {
        /*
        * This function open the calories DB
        * Input: dbName, dbVersionNumber
        * Output: DB, also save into the db var
        */
        return new Promise((resolve, reject) => {
            const openRequest = window.indexedDB.open(dbName, versionNumber);
            //After we sand the open request - we define what will happen on every response.

            // Define what will happen when error occurred.
            openRequest.onerror = (event) => {
                console.log("idb.openCaloriesDB -> openRequest.onerror: " + event.target.error);
                reject("Failed to open the database");
            }

            // Define what will happen on success.
            openRequest.onsuccess = (event) => {
                console.log("idb.openCaloriesDB -> openRequest.onsuccess: " + event.target.result);
                idb.db = event.target.result;
                resolve(idb);
            }

            // Define what will happen when upgrade needed
            openRequest.onupgradeneeded = (event) => {
                console.log("idb.openCaloriesDB -> openRequest.onupgradeneeded: " + event.target.result);
                idb.db = event.target.result;

                // In case that the caloriesTable not created yet - we'll create it.
                if (!idb.db.objectStoreNames.contains('caloriesTable')) {
                    console.log("idb.openCaloriesDB -> openRequest.onupgradeneeded: create the caloriesTable");
                    idb.db.createObjectStore('caloriesTable', {autoIncrement: true});
                }
            }
        });
    },

    addCalories: async function (item) {
        /*
        * This Function use the DB we opened and add it a new item.
        * Input: item (json)
        * Output: updated DB, also saved into db var
        */
        return new Promise((resolve, reject) => {
            const transaction = idb.db.transaction(['caloriesTable'], 'readwrite');
            const objectStore = transaction.objectStore('caloriesTable');

            const addRequest = objectStore.add(item);

            // Handle error occurred
            addRequest.onerror = (event) => {
                console.log("idb.addCalories -> addRequest.onerror: " + event.target.error);
                reject("Failed adding new item");
            }

            // Handle success
            addRequest.onsuccess = (event) => {
                console.log("idb.addCalories -> addRequest.onsuccess: " + event.target.result);
                resolve(idb);
            }
        });
    },

    getCalories: async function () {
        /*
        * This function return the whole caloriesTable
        * Input: None
        * Output: caloriesTable as Json
        */
        return new Promise((resolve, reject) => {
            const objectStore = idb.db.transaction("caloriesTable", 'readonly').objectStore("caloriesTable");
            const getRequest = objectStore.getAll();

            // Handle error occurred
            getRequest.onerror = (event) => {
                console.log("idb.getCalories -> getRequest.onerror: " + event.target.error);
                reject("Failed getting the table data");
            }

            // Handle success
            getRequest.onsuccess = (event) => {
                console.log("idb.getCalories -> getRequest.onsuccess: " + event.target.result);
                const jsonData = JSON.stringify(event.target.result, null, 2);
                resolve(jsonData);
            }
        });

    }
}

export default idb;