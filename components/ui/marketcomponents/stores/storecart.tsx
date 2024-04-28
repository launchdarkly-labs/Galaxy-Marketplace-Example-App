import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useToast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}
// @ts-nocheck
export function StoreCart({ cart, setCart }: { cart: any; setCart: any }) {
  const router = useRouter();

  const LDClient = useLDClient();

  const totalCost = (cart || []).reduce(
    (total: number, item: InventoryItem) => total + Number(item.cost),
    0
  );

  const cartNumOfItems = cart.length;
  const { toast } = useToast();

  const cartClick = () => {
    LDClient?.track("cart-accessed", LDClient.getContext(), 1);
  };

  const checkOut = () => {
    toast({
      title: `Checkout is successful! Enjoy your purchase!`,
      wrapperStyle: "bg-marketgradient1 text-black font-sohne text-3xl"
    });

    setCart([]);
    router.push("/marketplace");
  };

  const checkOutTracking = () => {
    LDClient?.track("customer-checkout", LDClient.getContext(), 1);
  };

  return (
    <Sheet>
      <SheetTrigger onClick={() => cartClick()} asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart className="cart" color={"white"} />
          <div className="bg-marketgradient1 w-3 h-3 sm:w-[1rem] sm:h-[1rem] flex justify-center align-center items-center  rounded-[100%] absolute top-[-5px] right-[-10px]">
            <span className="text-black mt-[.15rem] sm:mt-1 absolute text-xs sm:text-sm ">
              {cartNumOfItems}
            </span>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl bg-gradient-experimentation text-transparent bg-clip-text">
            Cart
          </SheetTitle>

        </SheetHeader>
        <Table className="font-sohnelight">
          {/* <TableCaption>Your Items</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.length > 0 ? (
              cart?.map((item: InventoryItem, index: number) => {
                return (
                  <TableRow key={`${item.id}-${index}`}>
                    <TableCell> <img src={`${item.image}`} alt={item.item} /></TableCell>
                    <TableCell className="">{item.item}</TableCell>
                    <TableCell className="">${item.cost}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow key={1}>
                <TableCell className="">Add an Item!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <hr className="my-4 border-t border-gray-200" />

        <SheetFooter>
          <div className="w-full px-4 ">
            <div className="w-full px-4 flex justify-between">
              <p className="pb-4 font-sohne">Total:</p>
              <p className="pb-4 font-sohne">${totalCost.toFixed(2)}</p>
            </div>
            <SheetTrigger onClick={checkOut} asChild>
              <Button
                onClick={checkOutTracking}
                className="w-full bg-gradient-experimentation hover:brightness-[120%] rounded-none"
              >
                Checkout
              </Button>
            </SheetTrigger>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
