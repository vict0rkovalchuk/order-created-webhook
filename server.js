const express = require("express");
const axios = require("axios");
const { LoremIpsum } = require("lorem-ipsum");

const app = express();

app.use(express.json());

const SHOP = "digitalsuits.myshopify.com";
const ACCESS_TOKEN = "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";

const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 3, min: 2 },
  wordsPerSentence: { max: 8, min: 4 }
});

app.post("/webhooks/orders/create", async (req, res) => {
  const order = req.body;
  const orderId = order.id;
  const randomText = lorem.generateParagraphs(1);

  try {
    await axios.post(
      `https://${SHOP}/admin/api/2024-01/orders/${orderId}/metafields.json`,
      {
        metafield: {
          namespace: "custom",
          key: "random_text",
          type: "multi_line_text_field",
          value: randomText
        }
      },
      {
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SUCCESS!!!");
  } catch (error) {
    console.error("ERROR CREATING METAFIELD!!!");
  }

  res.status(200).send("OK");
});


app.listen(3000, () => {
  console.log("Server 3000 running");
});
