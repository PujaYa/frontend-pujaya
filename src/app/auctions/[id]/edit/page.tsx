import EditAuctionForm from "@/components/Forms/auction/EditAuctionForm";
import { getAuctionById } from "@/app/auctions/actions";
import { notFound } from "next/navigation";

export default async function EditAuctionPage(props: any) {
  const params = await props.params;
  const auction = await getAuctionById(params.id);
  if (!auction) return notFound();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Subasta</h1>
      <EditAuctionForm initialData={auction} />
    </div>
  );
}
