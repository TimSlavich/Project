const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const Farmers = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    contactNumber: String,
    email: { type: String, unique: true },
    password: String
});

const Sensors = new mongoose.Schema({
    DataID: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    FarmerID: { type: mongoose.Schema.Types.ObjectId, ref: 'farmers', required: true },
    SensorID: { type: String, required: true },
    TypeName: { type: String, required: true },
    Description: { type: String, required: true },
    Timestamp: { type: Date, default: Date.now },
    Value: { type: String, required: true }
});

const plantsStatus = new mongoose.Schema({
    FarmerID: { type: mongoose.Schema.Types.ObjectId, ref: 'farmers', required: true },
    name: { type: String, required: true },
    ripeness: { type: String, required: true },
    growth: { type: String, required: true },
    value: { type: String, required: true },
});

const Users = new mongoose.Schema({
    FarmerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmers', required: true },
    farmName: { type: String, required: true },
    farmStatus: { type: String, required: true },
    applications: { type: [String], required: true },
    contracts: { type: [String], required: true },
    plans: { type: [String], required: true },
    tasks: { type: [String], required: true }
});

const User = mongoose.model('user', Users);
const Farmer = mongoose.model('farmers', Farmers);
const Sensor = mongoose.model('sensor', Sensors);
const PlantStatus = mongoose.model('plantStatus', plantsStatus);

app.post('/register', async (req, res) => {
    const { firstName, lastName, address, contactNumber, email, password } = req.body;

    try {
        const farmer = new Farmer({ firstName, lastName, address, contactNumber, email, password });
        await farmer.save();
        res.status(201).send(farmer._id);
    } catch (error) {
        res.status(400).send({ error: 'Error registering user' });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const farmer = await Farmer.findOne({ email, password });
        if (farmer) {
            res.status(200).send(farmer._id);
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error logging in user' });
    }
});
app.get('/sensors/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    try {
        const sensors = await Sensor.find({ FarmerID: farmerId });
        res.status(200).send(sensors);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching sensors' });
    }
});
app.get('/plantStatus/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    try {
        const plantStatus = await PlantStatus.find({ FarmerID: farmerId }).populate('FarmerID');
        res.status(200).send(plantStatus);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching sensors' });
    }
})
app.get('/user/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    try {
        const farmer = await Farmer.find({ _id: farmerId }); 
        const user = await User.find({ FarmerID: farmerId }); 
        res.status(200).send({ farmer, user });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data' }); 
    }
});
app.put('/user/:farmerId/password', async (req, res) => {
    const { farmerId } = req.params;
    const { newPassword } = req.body;
    try {
        const farmer = await Farmer.findByIdAndUpdate(farmerId, { password: newPassword }, { new: true });
        res.status(200).send(farmer);
    } catch (error) {
        res.status(500).send({ error: 'Error updating password' });
    }
});

app.put('/sensors/:TypeName', async (req, res) => {
    try {
        const { TypeName } = req.params;
        const { newValue } = req.body;

        if (!newValue) {
            return res.status(400).send('Value is required');
        }

        const sensor = await Sensor.findOneAndUpdate(
            { TypeName }, 
            { Value: newValue },
            { new: true }
        );

        if (!sensor) {
            return res.status(404).send('Sensor not found');
        }

        res.send(sensor);
    } catch (error) {
        res.status(500).send(error.message);
    }
    console.log(req.body);
});

const updateSensorsData = async () => {
    try {
        const sensors = await Sensor.find();

        sensors.forEach(async sensor => {
            const randomValue = Math.floor(Math.random() * 100);
            if (sensor.TypeName !== 'Датчик поливу'){
                await Sensor.findByIdAndUpdate(sensor._id, { Value: randomValue.toString() }, { new: true });
            }
            
        });
    } catch (error) {
        console.error('Error updating sensor data:', error);
    }
};

setInterval(updateSensorsData, 5000);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
