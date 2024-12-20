import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import { auth } from "@clerk/nextjs/server";



export async function PUT(
    req: Request,
    {params}:{params: {courseId:string;}}
){
    try{
        const  { userId } = await auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status:404});
        }

        const {list} = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            },
        });

        if (!courseOwner){
            return new NextResponse("Unauthorized", {status:404});
        }

        for(let item of list){
            await db.chapter.update({
                where: {id: item.id},
                data: {position: item.position}
            });
        };

        return NextResponse.json("Success",{status:200});

    }catch(error){
        console.log("[REORDER]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}