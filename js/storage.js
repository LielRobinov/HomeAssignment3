// פונקציות כלליות לעבודה עם localStorage

function saveToStorage(key , value){
    const Stringvalue = JSON.stringify(value);
    localStorage.setItem(key , Stringvalue);
}

function loadFromStorage (key){
    const rawValue = localStorage.getItem(key);
    if (rawValue !== null){
        const parsedValue = JSON.parse(rawValue);
        return parsedValue;
    } 
    else{
        return [];
    }
}

function removeFromStorage(key){
    localStorage.removeItem(key);
}