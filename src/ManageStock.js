
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getValue } from '@testing-library/user-event/dist/utils';
import { useEffect, useState } from 'react';

function ManageStock() {
    const [Id, setId] = useState(null);
    const [Price, setPrice] = useState(null);
    const [DateValue, setDateValue] = useState(null);
    const [CategoryValue, setCategoryValue] = useState(null);
    const [SaleValue, setSaleValue] = useState(null);
    const [listOfIds, setListOfIds] = useState([1, 2, 3, 4]);
    const [listOfPrices, setListOfPrices] = useState([1042, 1011, 1047, 1002]);
    const [listOfDates, setListOfDates] = useState(["01/07/2022", "01/08/2022", "01/05/2022", "01/02/2022"]);
    const [listOfCategories, setListOfCategories] = useState([1, 2, 1, 2]);
    const [litsOfSales, setListOfSales] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const testDatabase = [
        {
            Id: 1,
            Price: 1042,
            DateValue: "01/07/2022",
            CategoryValue: 1
        },
        {
            Id: 2,
            Price: 1011,
            DateValue: "01/08/2022",
            CategoryValue: 2
        },
        {
            Id: 3,
            Price: 1047,
            DateValue: "01/05/2022",
            CategoryValue: 1
        },
        {
            Id: 4,
            Price: 1002,
            DateValue: "01/02/2022",
            CategoryValue: 2
        }
    ]

    useEffect(() => {
        let myheaders = new Headers();
        myheaders.append('content-type', 'application/json');
        myheaders.append('Accept', 'application/json');
        myheaders.append('Origin', 'http://localhost:7057');

        fetch('https://localhost:7057/api/Values',
            {
                method: 'GET',
                mode: 'no-cors'
            })
            .then((response) => {
                console.log(response.text());
                response.text();
            })
            .then((text) => text.length ? JSON.parse(text) : {})
            .catch((error) => {
                throw error;
            });
    }, []);

    const handleNewProduct = (e) => {
        setListOfIds(arr => [...arr, Id]);
        setListOfPrices(arr => [...arr, Price]);
        setListOfDates(arr => [...arr, DateValue]);
        setListOfCategories(arr => [...arr, CategoryValue]);
    }

    const getValue = (e) => {
        const field = e.target.outerHTML;
        const data = e.target.value;
        if (field.includes('Ingrese id')) {
            setId(data);
        } else if (field.includes('Amount Product')) {
            setPrice(data);
        } else if (field.includes('Ingrese fecha')) {
            setDateValue(data);
        } else if (field.includes('Seleccione')) {
            setCategoryValue(data);
        }
    }

    const getValueAndFilter = (e) => {
        const data = e.target.value;
        setSaleValue(data);
        const filterByPrice = testDatabase.filter(item => item.Price < data);
        setFilteredProducts(filterByPrice);
        const filterByCategoryOne = filterByPrice.filter(item => item.CategoryValue === 1);
        const filterByCategoryTwo = filterByPrice.filter(item => item.CategoryValue === 2);

        let i = 0;
        let maxIndexOne = i;
        for (i; i < filterByCategoryOne.length; i++) {
            if (filterByCategoryOne[i + 1]?.Price > filterByCategoryOne[i].Price) {
                const maxValueIndex = filterByCategoryOne[i + 1]?.Id;
                console.log(maxValueIndex);
                maxIndexOne = i + 1;
            }
        }

        let j = 0;
        let maxIndexTwo = j;
        for (j; j < filterByCategoryTwo.length; j++) {
            if (filterByCategoryTwo[j + 1]?.Price > filterByCategoryTwo[j].Price) {
                const maxValueIndex = filterByCategoryTwo[j + 1]?.Id;
                console.log(maxValueIndex);
                maxIndexTwo = j + 1;
            }
        }

        const productPriceOne = filterByCategoryOne[maxIndexOne]?.Price;
        const productPriceTwo = filterByCategoryTwo[maxIndexTwo]?.Price;

        if ((productPriceOne + productPriceTwo) < SaleValue) {
            const finalArray = [filterByCategoryOne[maxIndexOne], filterByCategoryTwo[maxIndexTwo]];
            setFilteredProducts(finalArray);
        } else {
            if (productPriceOne > productPriceTwo) {
                setFilteredProducts(filterByCategoryOne[maxIndexOne]);
            } else {
                setFilteredProducts(filterByCategoryTwo[maxIndexTwo]);
            }
        }
    }

    return (
        <>
            <br />
            <table>
                <th>
                    <td>
                        <div className='border-style'>

                            <label>Id: </label>
                            <Form.Control style={{ width: 240, marginBottom: 17 }}
                                onChange={(e) => getValue(e)} size="sm" type="text" placeholder="Ingrese id" />

                            <label>Precio: </label>
                            <div class="input-group mb-3" style={{ width: 240, marginTop: 5 }}>
                                <div class="input-group-prepend">
                                    <span class="input-group-text">$</span>
                                </div>
                                <input type="text"
                                    onChange={(e) => getValue(e)} class="form-control" aria-label="Amount Product (to the nearest dollar)" />
                            </div>

                            <label>Fecha: </label>
                            <Form.Control style={{ width: 240, marginBottom: 17 }} size="sm"
                                onChange={(e) => getValue(e)} type="text" placeholder="Ingrese fecha" />

                            <label>Categoría: </label>
                            <Form.Select aria-label="Default select example"
                                onChange={(e) => getValue(e)} style={{ width: 240 }}>
                                <option>Seleccione categoría: </option>
                                <option value="1">Uno</option>
                                <option value="2">Dos</option>
                            </Form.Select>

                            <Button variant="primary" style={{ marginLeft: 150, marginTop: 17 }}
                                onClick={(e) => handleNewProduct(e)}>
                                Aceptar</Button>
                        </div>
                    </td>
                    <td>
                        <label>Venta: </label>
                        <div class="input-group mb-3" style={{ width: 240, marginLeft: 5 }}>
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="text"
                                onChange={(e) => getValueAndFilter(e)} class="form-control" aria-label="Amount Sale (to the nearest dollar)" />
                        </div>
                    </td>
                    <td>
                        &nbsp;&nbsp;Lista de productos:
                        {
                            Array.isArray(filteredProducts) && filteredProducts.length > 0 ?
                                filteredProducts.map((item, index) => {
                                    return <li key={index}>{"Id: " + item.Id + "- Precio $" + item.Price + " Fecha: " + item.DateValue + " Categoría: " + item.CategoryValue}</li>
                                }) :
                                Array.isArray(listOfIds) &&
                                listOfIds.map((item, index) => {
                                    return SaleValue ?
                                        listOfPrices[index] < SaleValue ?
                                            <li key={index}>{"Id: " + item + "- Precio $" + listOfPrices[index] + " Fecha: " + listOfDates[index] + " Categoría: " + listOfCategories[index]}</li>
                                            : ""
                                        : <li key={index}>{"Id: " + item + "- Precio $" + listOfPrices[index] + " Fecha: " + listOfDates[index] + " Categoría: " + listOfCategories[index]}</li>
                                })
                        }
                    </td>
                </th>
            </table>
        </>
    );
}

export default ManageStock;