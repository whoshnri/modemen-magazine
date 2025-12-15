import { getSponsoredById } from "@/app/actions/cms/sponsored";
import { notFound } from "next/navigation";
import EditSponsoredClient from "./EditSponsoredClient";

export default async function EditSponsoredPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = await getSponsoredById(id);

    if (!item) {
        notFound();
    }

    return <EditSponsoredClient item={item} />;
}
