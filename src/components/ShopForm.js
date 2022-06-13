import React, { useState } from 'react';

const ShopForm = () => {

    const [areaSelected, setAreaSelected] = useState('all');
    const [categorySelected, setCategorySelected] = useState('all');
    const [shopData, setShopData] = useState({
        shopName: '',
        shopArea: 'Thane',
        shopCategory: 'Grocery',
        openingDate: '',
        closingDate: ''
    });

    const [formAlert, setFormAlert] = useState({ alertMessage: '', alertClass: '' });

    const onChange = (e) => {
        // console.log(shopData);
        setShopData({ ...shopData, [e.target.name]: e.target.value });
    }

    //get local storage
    function getLocalStorage() {
        return localStorage.getItem('shop-list') ? JSON.parse(localStorage.getItem('shop-list')) : [];
    }

    //create a shop
    function createShop(shop, id) {
        var listContainer = document.querySelector('.list-container');
        // console.log(listContainer.innerHTML);
        const element = document.createElement('div');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add('row', 'text-center', 'mb-2', 'shop');
        element.innerHTML = `<div class="flex-grow-1 col-11 row g-2">
        <div class="col-sm-6 col-md-4 col-lg-3">
            <label class='fw-bold' htmlFor='1'>Shop Name: </label>
            <span id='1' class='mx-2'>${shop.shopName}</span>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-3">
            <label class='fw-bold' htmlFor='1'>Shop Area: </label>
            <span id='1' class='mx-2'>${shop.shopArea}</span>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-3">
            <label class='fw-bold' htmlFor='1'>Shop Category: </label>
            <span id='1' class='mx-2'>${shop.shopCategory}</span>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-3">
            <label class='fw-bold' htmlFor='1'>Opening Date: </label>
            <span id='1' class='mx-2'>${shop.openingDate}</span>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-3">
            <label class='fw-bold' htmlFor='1'>CLosing Date: </label>
            <span id='1' class='mx-2'>${shop.closingDate}</span>
        </div>
    </div>
    <button class="col-1 d-flex align-items-center justify-content-center delete-btn" style='background: transparent; border: transparent;'>
        <i class="fas fa-trash"></i>
    </button>`;

        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteShop);
        listContainer.appendChild(element);
        console.log('shop is created and appended to list container');
    }

    //delete shop..........
    function deleteShop(e) {
        const listContainer = document.querySelector('.list-container');
        const element = e.currentTarget.parentElement;
        console.log(element);
        const id = element.dataset.id;
        console.log(id);
        listContainer.removeChild(element);

        let shops = getLocalStorage();
        shops = shops.filter(function (shop) {
            if (shop.id !== id) {
                return shop;
            }
        });
        localStorage.setItem('shop-list', JSON.stringify(shops));
        console.log('shop deleted');
    }

    //all the shops are displayed that are stored in localstorage...............
    function showStoredShops() {
        var listContainer = document.querySelector('.list-container');
        setAreaSelected('all');
        setCategorySelected('all');
        listContainer.innerHTML = '';
        console.log('in show stored shops in local storage');
        const shopList = getLocalStorage();
        if (shopList.length > 0) {
            shopList.forEach(function (shop) {
                createShop(shop, shop.id);
            });
        }
        // showShopBtn.classList.add('d-none');
    }

    //add new shop............
    const addNewShop = (shopData) => {
        const id = new Date().getTime().toString();
        console.log(`id is created: ${id}`);
        createShop(shopData, id);
        let shopList = getLocalStorage();
        shopData['id'] = id;
        console.log(shopData);
        shopList.push(shopData);
        localStorage.setItem('shop-list', JSON.stringify(shopList));
        console.log('shop saved to local storage');
    }

    //select area change.........
    const selectAreaChange = (e) => {
        e.preventDefault();
        setAreaSelected(e.currentTarget.value);
        const area = document.querySelector('.select-area');
        // console.log(document.querySelector('.select-area').value);
        let shops = getLocalStorage();
        shops = shops.filter(shop => {
            if (shop.shopArea === area.value) {
                return shop;
            }
        });

        if(area.value === 'all'){
            showStoredShops();
        }
        else{
            const listContainer = document.querySelector('.list-container');
            listContainer.innerHTML = '';
            if(shops.length > 0){
                shops.forEach(shop=>{
                    createShop(shop, shop.id);
                });
            }
        }
    }

    //select category change..........
      const selectCategoryChange = (e) => {
        e.preventDefault();
        setCategorySelected(e.currentTarget.value);
        const category = document.querySelector('.select-category');
        let shops = getLocalStorage();
        shops = shops.filter(shop => {
            if (shop.shopCategory === category.value) {
                return shop;
            }
        });

        if(category.value === 'all'){
            showStoredShops();
        }
        else{
            const listContainer = document.querySelector('.list-container');
            listContainer.innerHTML = '';
            if(shops.length > 0){
                shops.forEach(shop=>{
                    createShop(shop, shop.id);
                });
            }
        }
    }

    //shop form submitted........
    const handleSubmit = (e) => {
        e.preventDefault();

        const regName = /\d+$/g;
        const open = new Date(shopData.openingDate);
        const close = new Date(shopData.closingDate);
        // console.log(open.getTime(), close.getTime());

        if (shopData.shopName === '') {
            setFormAlert({ alertMessage: 'Please enter shop name', alertClass: 'alert-danger' });
            setTimeout(() => {
                setFormAlert({ alertMessage: '', alertClass: '' });
            }, [1500]);
            return false;
        }

        else if (regName.test(shopData.shopName)) {
            setFormAlert({ alertMessage: 'Shop name should not contain numeric values', alertClass: 'alert-danger' });
            setTimeout(() => {
                setFormAlert({ alertMessage: '', alertClass: '' });
            }, [1500]);
            return false;
        }

        else if (shopData.openingDate === '') {
            setFormAlert({ alertMessage: 'Please enter shop opening date', alertClass: 'alert-danger' });
            setTimeout(() => {
                setFormAlert({ alertMessage: '', alertClass: '' });
            }, 1500);
            return false;
        }

        else if (shopData.closingDate === '') {
            setFormAlert({ alertMessage: 'Please enter shop closing date', alertClass: 'alert-danger' });
            setTimeout(() => {
                setFormAlert({ alertMessage: '', alertClass: '' });
            }, 1500);
            return false;
        }

        else if (open.getTime() > close.getTime()) {
            setFormAlert({ alertMessage: 'Opening date must be before closing date', alertClass: 'alert-danger' });
            setTimeout(() => {
                setFormAlert({ alertMessage: '', alertClass: '' });
            }, 1500);
            return false;
        }

        else {
            console.log('form submitted');
            addNewShop(shopData);
            setShopData({
                shopName: '',
                shopArea: 'Thane',
                shopCategory: 'Grocery',
                openingDate: '',
                closingDate: ''
            });
        }
    }
    return (
        <>
            <div className='my-5 p-3 shadow container form-container'>
                <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                        <h3 className="mb-2 shop-title">Shop Form</h3>
                    </div>
                    {<div className={`alert form-alert ${formAlert.alertClass}`}>{formAlert.alertMessage}</div>}
                    <div className="mb-4">
                        <label htmlFor="shop-name" className="form-label text-start">Name of the Shop</label>
                        <input type="text" value={shopData.shopName} className="form-control" id="shop-name" name='shopName' onChange={onChange} />
                    </div>
                    <div className=" mb-4 row">
                        <div className="col-12 col-md-6">
                            <label htmlFor="shopAreas" className="form-label">Area of Shop</label>
                            <select className='form-control' name='shopArea' value={shopData.shopArea} id='shopAreas' onChange={onChange} >
                                <option value="Thane">Thane</option>
                                <option value="Pune">Pune</option>
                                <option value="Mumbai Suburban">Mumbai Suburban</option>
                                <option value="Nashik">Nashik</option>
                                <option value="Nagpur">Nagpur</option>
                                <option value="Ahmednager">Ahmednager</option>
                                <option value="Solapur">Solapur</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="shopCategories" className="form-label">Category of Shop</label>
                            <select className='form-control' value={shopData.shopCategory} id="shopCategories" name='shopCategory' onChange={onChange}>
                                <option value="Grocery">Grocery</option>
                                <option value="Butcher">Butcher</option>
                                <option value="Baker">Baker</option>
                                <option value="Chemist">Chemist</option>
                                <option value="Stationery">Stationary</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4 row">
                        <div className="col-12 col-md-6">
                            <label htmlFor="opening-date" className="form-label">Opening Date</label>
                            <input type="date" value={shopData.openingDate} className="form-control" name='openingDate' id="opening-date" onChange={onChange} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="closing-date" className="form-label">Closing Date</label>
                            <input type="date" value={shopData.closingDate} className="form-control" name='closingDate' id="closing-date" onChange={onChange} />
                        </div>
                    </div>
                    <button type="submit" className='btn btn-secondary'>Add Shop</button>
                </form>
            </div>

            <div className='container'>
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className='my-4'>Shop List</h2>
                    <div>
                        <select className='p-2 fs-4 mx-2 select-area' value={areaSelected} onChange={selectAreaChange} style={{ border: '3px solid #f1f4f8', borderRadius: '10px' }}>
                            <option value="all" className='filter-area'>Filter by Area</option>
                            <option value="Thane" className='filter-area'>Thane</option>
                            <option value="Pune" className='filter-area'>Pune</option>
                            <option value="Mumbai Suburban" className='filter-area'>Mumbai Suburban</option>
                            <option value="Nashik" className='filter-area'>Nashik</option>
                            <option value="Nagpur" className='filter-area'>Nagpur</option>
                            <option value="Ahmednager" className='filter-area'>Ahmednager</option>
                            <option value="Solapur" className='filter-area'>Solapur</option>
                        </select>
                        <select className='p-2 fs-4 mx-2 select-category' value={categorySelected} onChange={selectCategoryChange} style={{ border: '3px solid #f1f4f8', borderRadius: '10px' }}>
                            <option value='all'>Filter by Category</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Butcher">Butcher</option>
                            <option value="Baker">Baker</option>
                            <option value="Chemist">Chemist</option>
                            <option value="Stationery">Stationary</option>
                        </select>
                    </div>
                </div>
                <div className="text-center">
                    <button className="btn btn-primary my-2 text-center show-local-shops" onClick={showStoredShops}>Reload Shops</button>
                    <div className="list-container">

                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopForm;