
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentWrapper from "./payment-wrapper";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type Props = {
    params: Promise<{ orderId: string }>;
};

export default async function OrderPage(props: Props) {
    const params = await props.params;
    const { orderId } = params;

    const resolved = decodeURIComponent(orderId)
    console.log(resolved)


    const order = await prisma.order.findUnique({
        where: { id : resolved.trim() },
        include: {
            user: {
                select: { email: true, name: true },
            },
        },
    });

    if (!order) {
        return <>
            {JSON.stringify(order)}
        </>
    }



    return (
        <div className="min-h-screen bg-black-primary flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
                <div className="flex-1 container max-w-4xl mx-auto px-4 py-12 sm:py-24">
                    <div className="border border-border bg-black-secondary/20 p-8 sm:p-12 rounded-none">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-8 text-center border-b border-border pb-6">
                            {order.paid ? "ORDER COMPLETED" : "COMPLETE YOUR ORDER"}
                        </h1>

                        <div className="mb-8 text-center">
                            <p className="text-muted-foreground uppercase tracking-wider text-sm mb-2">
                                Order ID
                            </p>
                            <p className="font-mono text-gold-primary text-lg break-all">
                                {order.id}
                            </p>
                        </div>

                        <div className="mb-12 text-center">
                            <p className="text-muted-foreground uppercase tracking-wider text-sm mb-2">
                                Total Amount
                            </p>
                            <p className="text-4xl font-bold text-white">
                                ${order.total.toFixed(2)}
                            </p>
                        </div>

                        <PaymentWrapper
                            orderId={order.id}
                            email={order.user?.email ?? undefined}
                            amount={order.total}
                            orderStatus={order.paid}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}