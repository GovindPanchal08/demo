import * as amqplib from "amqplib";
import config from "../../config/config";

let connection: amqplib.Connection | null = null;
let channel: amqplib.Channel | null = null;

const MAX_RETRIES = 5;
let retries = 0;

export function getConnection(): amqplib.Connection {
  if (!connection) throw new Error("RabbitMQ connection not initialized");
  return connection;
}

export function getChannel(): amqplib.Channel {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}

export async function connect(): Promise<void> {
  if (connection) return;

  try {
    const conn = (await amqplib.connect(config.RABBITMQ_URL)) as unknown as amqplib.Connection;
    connection = conn;
    console.log("Connected to RabbitMQ");

    conn.on("close", () => {
      console.log("RabbitMQ connection closed, reconnecting...");
      connection = null;
      channel = null;
      setTimeout(connect, 5000);
    });

    conn.on("error", (err) => {
      console.log("RabbitMQ connection error:", err);
    });

    const ch = (await (conn as any).createChannel()) as amqplib.Channel;
    channel = ch;

    ch.on("close", () => {
      console.log("RabbitMQ channel closed");
    });
  } catch (error) {
    console.log("Error connecting to RabbitMQ:", error);

    retries++;
    if (retries <= MAX_RETRIES) {
      console.log(`Retrying RabbitMQ connection... Attempt #${retries}`);
      setTimeout(connect, 5000);
    } else {
      console.log("Max retries reached. Stopping reconnect attempts.");
    }
  }
}

export async function publishToQueue(
  queueName: string,
  data: Record<string, any> = {}
): Promise<void> {
  if (!connection || !channel) await connect();

  const ch = getChannel();

  await ch.assertQueue(queueName, { durable: true });
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

  console.log(`Message sent to queue "${queueName}":`, data);
}

export async function subscribeToQueue(
  queueName: string,
  callback: (data: any) => Promise<void>
): Promise<void> {
  if (!connection || !channel) await connect();

  const ch = getChannel();

  await ch.assertQueue(queueName, { durable: true });

  ch.consume(queueName, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      await callback(data);
      ch.ack(msg);
    }
  });
}
