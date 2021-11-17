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
        id: "94011",
        name: "Organic Bananas",
        unit: 1,
        unit_type: "lbs",
        quantity: 1
    },
    {
        id: "4225",
        name: "Hass Avocados",
        unit: 1,
        unit_type: "ea",
        quantity: 1
    },
    {
        id: "94225",
        name: "Hass Avocados",
        unit: 1,
        unit_type: "ea",
        quantity: 1
    },
    {
        id: "027000380406",
        name: "Hunt's 100% Natural Diced Tomatoes",
        unit: 14.5,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "027000379882",
        name: "Hunt's 100% Natural Diced Tomatoes, 8ct",
        unit: 14.5,
        unit_type: "oz",
        quantity: 8
    },
    {
        id: "0001111081533",
        name: "Kroger Diced Tomatoes in Tomato Juice",
        unit: 14.5,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "049000000450",
        name: "Diet Coke - 20 fl oz Bottle",
        unit: 20,
        unit_type: "oz",
        quantity: 1
    },
    {
        id: "049000050110",
        name: "Diet Coke - 2 L Bottle",
        unit: 2,
        unit_type: "L",
        quantity: 1
    },
];

const product_tags = products.map(product => 
    product.name.split(" ").map(tag => 
        ({ product_id: product.id, tag: tag }))
).flat();

const tags = product_tags.map(product_tag => product_tag.tag)
    .filter((value, index, self) => self.indexOf(value) === index)

const shopping_lists = [
    {
        id: 1,
        owner: users[0],
        specific: [
            { list_id: 1, product_id: "027000380406"}
        ],
        generic: [
            { list_id: 1, description: "Bananas" }
        ]
    },
    {
        id: 2,
        owner: users[1],
        specific: [
            { list_id: 1, product_id: "4011"}
        ],
        generic: [
            { list_id: 1, description: "Diced Tomatoes" }
        ]
    }
];

const stores = [
    {
        name: "Kroger",
        id: 1,
        street1: "123 Street St",
        street2: "#45",
        zip: 97005,
        city: "Beaverton",
        state: "OR"
    },
    {
        name: "Albersons",
        id: 2,
        street1: "678 Avenue Ave",
        zip: 97005,
        city: "Beaverton",
        state: "OR"
    },
    {
        name: "Wal*Mart",
        id: 3,
        street1: "910 Broadway Way",
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
        product_id: "027000380406",
        price: 1.2
    },
    {
        username: users[0].username,
        store_id: 1,
        product_id: "0001111081533",
        price: 0.99
    },
    {
        username: users[1].username,
        store_id: 2,
        product_id: "027000380406",
        price: 0.89
    },
    {
        username: users[0].username,
        store_id: 1,
        product_id: "049000000450",
        price: 1.25
    },
    {
        username: users[0].username,
        store_id: 1,
        product_id: "049000050110",
        price: 1.89
    },
    {
        username: users[0].username,
        store_id: 2,
        product_id: "049000000450",
        price: 1.20
    },
    {
        username: users[1].username,
        store_id: 2,
        product_id: "049000050110",
        price: 1.99
    },
    {
        username: users[0].username,
        store_id: 3,
        product_id: "049000000450",
        price: 1
    },
    {
        username: users[0].username,
        store_id: 3,
        product_id: "049000050110",
        price: 1.50
    },
]

function getProduct (product_id) {
    return products.find(product => product.id == product_id)
}

function getPrices (store_id, product_id) {
    return prices.filter(price =>
        price.store_id == store_id &&
        price.product_id == product_id
    )
}

function registerArray (nock, serviceUrl, array, route, key, notFoundError) {
    array.forEach(item => nock(serviceUrl)
        .persist()
        .get(`/${route}/${item[key]}`)
        .reply(200, item)
    );

    nock(serviceUrl)
        .persist()
        .get(`/${route}/invalid`)
        .reply(404, notFoundError)
}

module.exports = {
    prices, products, product_tags,
    reviews, shopping_lists, stores,
    tags, users,
    getProduct, getPrices, registerArray
}