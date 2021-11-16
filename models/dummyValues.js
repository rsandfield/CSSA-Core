const users = [
    {
        username: "Primus",
        reputation: 14,
        rank: "newbie"
    },
    {
        username: "Secondus",
        reputation: 1400,
        rank: "vet"
    }
];

const products = [
    {
        id: "4011",
        name: "Bananas",
        unit: 1,
        unit_type: "lbs",
        quantity: 1
    },
    {
        id: "1234567890123456",
        name: "Canned Tomatoes",
        unit: 14.6,
        unit_type: "oz",
        quantity: 1
    }
];

const shopping_lists = [
    {
        specific: [],
        generic: []
    }
];

const stores = [
    {
        name: "Buy Mart",
        id: 1,
        street1: "123 Street St",
        street2: "#45",
        zip: 97005,
        city: "Beaverton",
        state: "OR"
    },
    {
        name: "Shop N Low",
        id: 2,
        street1: "678 Avenue Ave",
        zip: 97006,
        city: "Beaverton",
        state: "OR"
    }
];

const reviews = [
    {
        reviewer: users[0].username,
        store_id: stores[0].id,
        rating: 1,
        text: "It’s bad"
    },
    {
        reviewer: users[1].username,
        store_id: stores[0].id,
        rating: 2,
        text: "It’s not good"
    },
    {
        reviewer: users[0].username,
        store_id: stores[1].id,
        rating: 3,
        text: "It’s okay"
    },
    {
        reviewer: users[1].username,
        store_id: stores[1].id,
        rating: 4,
        text: "It’s good"
    }
];

const prices = [
    {
        username: users[0].username,
        store_id: 1,
        product_id: "4011",
        price: 0.47
    },
    {
        username: users[0].username,
        store_id: 1,
        product_id: "4011",
        price: 0.37,
        sale: true,
        sale_ends: 1
    },
    {
        username: users[1].username,
        store_id: 2,
        product_id: "4011",
        price: 0.67
    },
    {
        username: users[1].username,
        store_id: 2,
        product_id: "4011",
        price: 0.45,
        sale: true,
        sale_ends: Number.MAX_SAFE_INTEGER
    },
    {
        username: users[0].username,
        store_id: 1,
        product_id: "1234567890123456",
        price: 1.2
    },
    {
        username: users[1].username,
        store_id: 2,
        product_id: "1234567890123456",
        price: 0.89
    },
]

function getProductById (product_id) {
    return products.find(product => product.id == product_id)
}

function registerArray (nock, service, array, key) {
    array.forEach(item => nock(service.url)
        .persist()
        .get(`/${service.name}s/` + item[key])
        .reply(200, item)
    )
}

module.exports = { users, products, shopping_lists, stores, reviews, products, prices, getProductById, registerArray}