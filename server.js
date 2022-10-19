const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();