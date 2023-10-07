import type {Seller} from "@/types/Seller";
import type {Address} from "@/types/Address";

export type Property = {
    addr: Address,
    askingPrice: string,
    price: string,
    id: string,
    service_id: string,
    seller: Seller,
    description: string,
    created: string
}
